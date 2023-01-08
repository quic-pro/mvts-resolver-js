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


type NodeCache = {
    expirationTime: number;
    nodeData: Router.NodeDataStructOutput;
    codes: Map<number, NodeCache>;
};


export class Resolver {
    constructor(options: ResolverOptions = {}) {
        this.providers = new Map<number, Provider>();
        if (options.useDefaultRpcUrls ?? true) {
            this.addProviders(DEFAULT_RPC_URLS);
        }
        if (options.rpcUrlsAndProviders) {
            this.addProviders(options.rpcUrlsAndProviders);
        }

        this.curator = options.curator ?? getActualCurator(this.providers.get(ACTUAL_CURATOR_CHAIN_ID));
        this.cache = null;
        this.useCache = options.useCache ?? true;
    }


    // ----- [ PRIVATE PROPERTIES ] ------------------------------------------------------------------------------------

    private cache: NodeCache | null;


    // ----- [ PROTECTED PROPERTIES ] ----------------------------------------------------------------------------------

    protected useCache: boolean;


    // ----- [ PUBLIC PROPERTIES ] -------------------------------------------------------------------------------------

    public readonly providers: Map<number, Provider>;
    public readonly curator: Curator;


    // ----- [ PRIVATE METHODS ] ---------------------------------------------------------------------------------------

    private addProviders(rpcUrlsAndProviders: { [chainId: number]: string | Provider }): void {
        const entries = Object.entries(rpcUrlsAndProviders);
        entries.forEach(([chainId, rpcUrlOrProvider]) => {
            if (typeof rpcUrlOrProvider === 'string') {
                this.providers.set(Number(chainId), new JsonRpcProvider(rpcUrlOrProvider, chainId))
            } else {
                this.providers.set(Number(chainId), rpcUrlOrProvider);
            }
        });
    }


    // ----- [ PROTECTED METHODS ] -------------------------------------------------------------------------------------

    protected createCache(nodeData: Router.NodeDataStructOutput): NodeCache {
        return {
            expirationTime: Date.now() + nodeData.ttl.toNumber() * 1000,
            nodeData,
            codes: new Map<number, NodeCache>()
        };
    }

    protected getRootRouterData(): Promise<Router.NodeDataStructOutput> {
        if (this.useCache && this.cache && (Date.now() < this.cache.expirationTime)) {
            return Promise.resolve(this.cache.nodeData);
        }

        return this.curator.getRootRouter()
            .then((nodeData) => {
                this.cache = this.createCache(nodeData);
                return nodeData;
            });
    }

    protected getRouter(router: Router.RouterStructOutput): Router | never {
        const provider = this.providers.get(router.chainId.toNumber());
        if (!provider) {
            throw new Error(`Missing provider for chain ${router.chainId}.`);
        }

        return Router__factory.connect(router.adr, provider);
    }


    // ----- [ PUBLIC METHODS ] ----------------------------------------------------------------------------------------

    public getUseCache(): boolean {
        return this.useCache;
    }

    public setUseCache(useCache: boolean): void {
        this.useCache = useCache;
    }

    public clearCache(): void {
        this.cache = null;
    }

    public getSipUri(phoneNumber: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            let nodeData = await this.getRootRouterData();
            let routerCache = this.cache as NodeCache;

            let index = 0;
            while (index < phoneNumber.length) {
                const poolCodeLength = nodeData.router.poolCodeLength.toNumber();
                if (phoneNumber.length < index + poolCodeLength) {
                    reject(new Error('Phone number is wrong.'));
                }

                const code = Number(phoneNumber.substring(index, index + poolCodeLength));
                const callCache = this.useCache ? routerCache.codes.get(code) : null;
                if (callCache && (Date.now() < callCache.expirationTime)) {
                    nodeData = callCache.nodeData;
                } else {
                    const router = this.getRouter(nodeData.router);
                    nodeData = await router.getNodeData(code);
                    routerCache.codes.set(code, this.createCache(nodeData));
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
