import {Provider} from '@ethersproject/abstract-provider';
import {JsonRpcProvider} from '@ethersproject/providers';
import {BigNumber} from '@ethersproject/bignumber';

import {Curator, Router} from './contracts';


import {DEFAULT_CURATOR_ADDRESS, DEFAULT_CURATOR_CHAIN_ID, DEFAULT_RPC_URLS} from './constants';


type Options = {
    customProviders?: {
        [chainId: number]: Provider;
    };
    useOnlyCustomProviders?: boolean;
};

type MethodCallCache = {
    expirationTime: number;
    response: string[];
};

type CuratorCache = {
    getRootRouter: MethodCallCache;
};

type RouterCache = {
    getNextNode: Map<number, MethodCallCache>;
    childRouters: Map<number, RouterCache>
}


export default class Resolver {
    constructor(curator?: Curator, options?: Options) {
        this.providers = new Map<number, Provider>();
        if (!options || !options.useOnlyCustomProviders) {
            const entries = Object.entries(DEFAULT_RPC_URLS);
            entries.forEach(([chainId, url]) => this.providers.set(Number(chainId), new JsonRpcProvider(url)));
        }
        if (options && options.customProviders) {
            const entries = Object.entries(options.customProviders);
            entries.forEach(([chainId, provider]) => this.providers.set(Number(chainId), provider));
        }

        if (!curator) {
            const provider = this.providers.get(DEFAULT_CURATOR_CHAIN_ID);
            if (!provider) {
                throw new Error(`Chain ${DEFAULT_CURATOR_CHAIN_ID} not supported: provider is missing.`);
            }
            curator = new Curator(DEFAULT_CURATOR_ADDRESS, provider);
        }
        this.curator = curator;

        this.router = null;

        this.curatorCache = {
            getRootRouter: {
                expirationTime: 0,
                response: []
            }
        };

        this.rootRouterCache = {
            getNextNode: new Map<number, MethodCallCache>(),
            childRouters: new Map<number, RouterCache>()
        };
    }


    // ----- [ PRIVATE PROPERTIES ] ------------------------------------------------------------------------------------

    private readonly providers: Map<number, Provider>;
    private readonly curator: Curator;

    private readonly curatorCache: CuratorCache;
    private readonly rootRouterCache: RouterCache;

    private router: Router | null;


    // ----- [ STATIC PRIVATE METHODS ] --------------------------------------------------------------------------------

    private static responsesIdentical(a: string[], b: string[]): boolean {
        if (a.length != b.length) {
            return false;
        }

        for (let i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) {
                return false;
            }
        }

        return true;
    }

    private static updateRouterCache(routerCache: RouterCache, code: number, response: string[]): void {
        routerCache.getNextNode.set(code, {
            expirationTime: Date.now() + Number(response[4]) * 1000,
            response: response
        });

        if (response[1] !== '0') {
            routerCache.childRouters.set(code, {
                getNextNode: new Map<number, MethodCallCache>(),
                childRouters: new Map<number, RouterCache>()
            });
        }
    }


    // ----- [ PRIVATE METHODS ] ---------------------------------------------------------------------------------------

    private getRootRouterData(): Promise<string[]> {
        const cache = this.curatorCache.getRootRouter;
        if ((Date.now() < cache.expirationTime) && (cache.response[0] === '200')) {
            return Promise.resolve(cache.response);
        }

        return new Promise((resolve, reject) => {
            this.curator.getRootRouter()
                .then((rootRouterData) => {
                    cache.expirationTime = Date.now() + Number(rootRouterData[4]) * 1000;
                    if (!Resolver.responsesIdentical(cache.response, rootRouterData)) {
                        this.rootRouterCache.getNextNode.clear();
                        this.rootRouterCache.childRouters.clear();
                        cache.response = rootRouterData;
                    }

                    if (rootRouterData[0] === '200') {
                        resolve(rootRouterData);
                    } else {
                        reject(rootRouterData);
                    }
                })
                .catch(reject);
        });
    }

    private getRouter(chainId: number, address: string): Router {
        const provider = this.providers.get(chainId);
        if (!provider) {
            throw new Error(`Chain ${DEFAULT_CURATOR_CHAIN_ID} not supported: provider is missing.`);
        }

        if (!this.router) {
            this.router = new Router(address, provider);
        } else {
            this.router.updateContract(address, provider);
        }

        return this.router;
    }

    private getNextNodeData(nodeData: string[], code: number): Promise<string[]> {
        const router = this.getRouter(Number(nodeData[2]), nodeData[3]);
        return router.getNextNode(BigNumber.from(code));
    }


    // ----- [ PUBLIC METHODS ] ----------------------------------------------------------------------------------------

    public getAddress(phoneNumber: string): Promise<string[]> {
        return new Promise(async (resolve, reject) => {
            let nodeData = await this.getRootRouterData();
            let routerCache = this.rootRouterCache;

            let index = 0;
            while (index < phoneNumber.length) {
                const poolCodeLength = Number(nodeData[1]);
                if (phoneNumber.length < index + poolCodeLength) {
                    reject(['400', '', '', '', '']);
                }

                const code = Number(phoneNumber.substring(index, index + poolCodeLength));
                const callCache = routerCache.getNextNode.get(code);
                if (callCache && (Date.now() < callCache.expirationTime)) {
                    nodeData = callCache.response;
                } else {
                    nodeData = await this.getNextNodeData(nodeData, code);
                    Resolver.updateRouterCache(routerCache, code, nodeData);
                }

                if (nodeData[0] !== '200') {
                    reject(nodeData);
                }

                // @ts-ignore
                routerCache = routerCache.childRouters.get(code);

                index += poolCodeLength;
            }

            resolve(nodeData);
        });
    }
}
