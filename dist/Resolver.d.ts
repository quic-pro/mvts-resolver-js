import { Provider } from '@ethersproject/providers';
import { Curator, Router } from '@mvts/contract-interfaces-js';
export type ResolverOptions = {
    curator?: Curator;
    rpcUrlsAndProviders?: Record<number, string | Provider>;
    useDefaultRpcUrls?: boolean;
    useCache?: boolean;
};
type NodeCache = {
    expirationTime: number;
    nodeData: Router.NodeDataStructOutput;
    codes: Map<number, NodeCache>;
};
export declare class Resolver {
    constructor(options?: ResolverOptions);
    private cache;
    protected useCache: boolean;
    readonly providers: Map<number, Provider>;
    readonly curator: Curator;
    private addProviders;
    protected getRootRouterData(): Promise<Router.NodeDataStructOutput>;
    protected createCache(nodeData: Router.NodeDataStructOutput): NodeCache;
    protected getNodeData(phoneNumber: string): Promise<Router.NodeDataStructOutput>;
    protected getRouter(router: Router.RouterStructOutput): Router | never;
    getUseCache(): boolean;
    setUseCache(useCache: boolean): void;
    clearCache(): void;
    getSipUri(phoneNumber: string): Promise<string>;
}
export {};
