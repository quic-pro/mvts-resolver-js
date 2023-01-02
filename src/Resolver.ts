import {Provider, JsonRpcProvider} from '@ethersproject/providers';
import {Curator, Router, Router__factory} from '@mvts/contract-interfaces-js';


import {ACTUAL_CURATOR_CHAIN_ID, DEFAULT_RPC_URLS} from './constants';
import {getActualCurator} from './utils';
import {ResponseCode} from './types';


export type ResolverOptions = {
    curator?: Curator;
    rpcUrlsAndProviders?: {
        [chainId: number]: string | Provider;
    };
    useDefaultRpcUrls?: boolean;
    useCache?: boolean;
};


type Cache = {
    expirationTime: number;
    nodeData: Router.NodeDataStructOutput;
    codes: Map<number, Cache>;
};


export class Resolver {
    constructor(options: ResolverOptions = {}) {
        this.providers = new Map<number, Provider>();

        if (options.useDefaultRpcUrls) {
            const entries = Object.entries(DEFAULT_RPC_URLS);
            entries.forEach(([chainId, rpcUrl]) => this.providers.set(Number(chainId), new JsonRpcProvider(rpcUrl)));
        }
        if (options.rpcUrlsAndProviders) {
            const entries = Object.entries(options.rpcUrlsAndProviders);
            entries.forEach(([chainId, rpcUrlOrProvider]) => {
                if (typeof rpcUrlOrProvider === 'string') {
                    this.providers.set(Number(chainId), new JsonRpcProvider(rpcUrlOrProvider, chainId))
                } else {
                    this.providers.set(Number(chainId), rpcUrlOrProvider);
                }
            });
        }

        if (options.curator) {
            this.curator = options.curator;
        } else {
            this.curator = getActualCurator(this.providers.get(ACTUAL_CURATOR_CHAIN_ID));
        }

        this.cache = null;
        this.useCache = options.useCache ?? true;
    }


    // ----- [ PRIVATE PROPERTIES ] ------------------------------------------------------------------------------------

    private cache: Cache | null;
    private useCache: boolean;


    // ----- [ PUBLIC PROPERTIES ] -------------------------------------------------------------------------------------

    public readonly providers: Map<number, Provider>;
    public readonly curator: Curator;


    // ----- [ PRIVATE METHODS ] ---------------------------------------------------------------------------------------

    private getRootRouterData(): Promise<Router.NodeDataStructOutput> {
        if (this.cache && (Date.now() < this.cache.expirationTime)) {
            return Promise.resolve(this.cache.nodeData);
        }

        return new Promise((resolve, reject) => {
            this.curator.getRootRouter()
                .then((nodeData) => {
                    this.cache = {
                        expirationTime: Date.now() + nodeData.ttl.toNumber() * 1000,
                        nodeData,
                        codes: new Map<number, Cache>()
                    };

                    if (nodeData.responseCode.eq(ResponseCode.OK)) {
                        resolve(this.cache.nodeData);
                    } else {
                        reject(new Error('Failed to get node data.'));
                    }
                })
                .catch(reject);
        });
    }

    private getRouter(router: Router.RouterStructOutput): Router {
        const provider = this.providers.get(router.chainId.toNumber());
        if (!provider) {
            throw new Error(`Chain ${ACTUAL_CURATOR_CHAIN_ID} not supported: provider is missing.`);
        }

        return Router__factory.connect(router.adr, provider);
    }


    // ----- [ PUBLIC METHODS ] ----------------------------------------------------------------------------------------

    public getSipUri(phoneNumber: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            let nodeData = await this.getRootRouterData();
            let routerCache = this.cache as Cache;

            let index = 0;
            while (index < phoneNumber.length) {
                const poolCodeLength = nodeData.router.poolCodeLength.toNumber();
                if (phoneNumber.length < index + poolCodeLength) {
                    reject(new Error(''));
                }

                const code = Number(phoneNumber.substring(index, index + poolCodeLength));
                const callCache = this.useCache ? routerCache.codes.get(code) : null;
                if (callCache && (Date.now() < callCache.expirationTime)) {
                    nodeData = callCache.nodeData;
                } else {
                    const router = this.getRouter(nodeData.router);
                    nodeData = await router.getNodeData(code);
                    routerCache.codes.set(code, {
                        expirationTime: Date.now() + nodeData.ttl.toNumber() * 1000,
                        nodeData,
                        codes: new Map<number, Cache>()
                    });
                }

                if (!nodeData.responseCode.eq(ResponseCode.OK)) {
                    reject(nodeData);
                }

                // @ts-ignore
                routerCache = routerCache.codes.get(code);

                index += poolCodeLength;
            }

            resolve(nodeData.sipUri);
        });
    }
}
