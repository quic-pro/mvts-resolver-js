import {ContractConfig} from './contracts/types';


export type ResolverConfig = {
    curatorConfig?: Partial<ContractConfig>;
    rootRouterAbi?: any;
    routerAbi?: any;
};
