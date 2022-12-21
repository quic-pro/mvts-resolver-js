import { Provider } from '@ethersproject/abstract-provider';
import { Curator } from './contracts';
type Options = {
    customProviders?: {
        [chainId: number]: Provider;
    };
    useOnlyCustomProviders?: boolean;
};
export default class Resolver {
    constructor(curator?: Curator, options?: Options);
    private readonly providers;
    private readonly curator;
    private readonly curatorCache;
    private readonly rootRouterCache;
    private router;
    private static responsesIdentical;
    private static updateRouterCache;
    private getRootRouterData;
    private getRouter;
    private getNextNodeData;
    getPhoneNumberData(phoneNumber: string): Promise<string[]>;
}
export {};
