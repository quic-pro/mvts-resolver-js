import {CuratorConfig} from './contracts/Curator/types';


export type ResolverConfig = {
    curatorConfig?: CuratorConfig;
    rpcUrls?: {
        [key: number]: string;
    };
};
