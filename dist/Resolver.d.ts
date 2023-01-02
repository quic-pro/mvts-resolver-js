import { Provider } from '@ethersproject/providers';
import { Curator } from '@mvts/contract-interfaces-js';
export type ResolverOptions = {
    curator?: Curator;
    rpcUrlsAndProviders?: {
        [chainId: number]: string | Provider;
    };
    useDefaultRpcUrls?: boolean;
    useCache?: boolean;
};
export declare class Resolver {
    constructor(options?: ResolverOptions);
    private cache;
    private useCache;
    readonly providers: Map<number, Provider>;
    readonly curator: Curator;
    private getRootRouterData;
    private getRouter;
    getSipUri(phoneNumber: string): Promise<string>;
}
