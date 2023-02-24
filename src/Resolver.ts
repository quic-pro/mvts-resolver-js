import {Provider, JsonRpcProvider} from '@ethersproject/providers';
import {CodeMode, Curator, ResponseCode, Router, RouterFactory} from '@mvts/contract-interfaces-js';

import {ACTUAL_CURATOR_CHAIN_ID, DEFAULT_RPC_URLS, ACTUAL_TEST_CURATOR_CHAIN_ID, DEFAULT_TEST_RPC_URLS} from './constants';
import {getActualCurator} from './utils';


export type ResolverOptions = {
    curator?: Curator;
    rpcUrlsAndProviders?: Record<number, string | Provider>;
    useDefaultRpcUrls?: boolean;
    useCache?: boolean;
    testnet?: boolean;
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
            this.addProviders(options.testnet ? DEFAULT_TEST_RPC_URLS : DEFAULT_RPC_URLS);
        }
        if (options.rpcUrlsAndProviders) {
            this.addProviders(options.rpcUrlsAndProviders);
        }

        this.curator = options.curator ?? getActualCurator(this.providers.get(options.testnet ? ACTUAL_TEST_CURATOR_CHAIN_ID : ACTUAL_CURATOR_CHAIN_ID));
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

    private addProviders(rpcUrlsAndProviders: Record<number, string | Provider>): void {
        const entries = Object.entries(rpcUrlsAndProviders);
        entries.forEach(([chainId, rpcUrlOrProvider]) => {
            if (typeof rpcUrlOrProvider === 'string') {
                this.providers.set(Number(chainId), new JsonRpcProvider(rpcUrlOrProvider));
            } else {
                this.providers.set(Number(chainId), rpcUrlOrProvider);
            }
        });
    }


    // ----- [ PROTECTED METHODS ] -------------------------------------------------------------------------------------

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

    protected createCache(nodeData: Router.NodeDataStructOutput): NodeCache {
        return {
            expirationTime: Date.now() + nodeData.ttl.toNumber() * 1000,
            nodeData,
            codes: new Map<number, NodeCache>(),
        };
    }

    protected async getNodeData(phoneNumber: string): Promise<Router.NodeDataStructOutput> {
        let nodeData = await this.getRootRouterData();
        let routerCache = this.cache;

        do {
            if (nodeData.mode !== CodeMode.Pool) {
                throw new Error('Invalid phone number: intermediate node is not a pool.');
            }

            const poolCodeLength = nodeData.router.poolCodeLength.toNumber();
            if (phoneNumber.length < poolCodeLength) {
                throw new Error('Invalid phone number: invalid length.');
            }

            const code = Number(phoneNumber.slice(0, poolCodeLength));
            if (isNaN(code)) {
                throw new Error('Invalid phone number: invalid symbols.');
            }
            phoneNumber = phoneNumber.slice(poolCodeLength);

            const codeCache = routerCache?.codes.get(code) ?? null;
            if (this.useCache && codeCache && (Date.now() < codeCache.expirationTime)) {
                nodeData = codeCache.nodeData;
            } else {
                const router = this.getRouter(nodeData.router);
                nodeData = await router.getNodeData(code);
                routerCache?.codes.set(code, this.createCache(nodeData));
            }

            if (!nodeData.responseCode.eq(ResponseCode.OK)) {
                throw new Error(`Response code ${nodeData.responseCode.toString()}.`);
            }

            routerCache = routerCache?.codes.get(code) ?? null;
        } while (phoneNumber.length);

        return nodeData;
    }

    protected getRouter(router: Router.RouterStructOutput): Router | never {
        const provider = this.providers.get(router.chainId.toNumber());
        if (!provider) {
            throw new Error(`Missing provider for chain ${router.chainId.toString()}.`);
        }

        return RouterFactory.connect(router.adr, provider);
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
        return this.getNodeData(phoneNumber)
            .then((nodeData) => {
                if (nodeData.mode !== CodeMode.Number) {
                    throw new Error('Invalid phone number: invalid length.');
                }

                return nodeData.sipUri;
            });
    }
}
