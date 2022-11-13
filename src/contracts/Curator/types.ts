import {BigNumber} from '@ethersproject/bignumber';


export type CuratorConfig = {
    chainId: number;
    address: string;
};

export type RootRouterData = {
    ttl: BigNumber;
    chainId: BigNumber;
    adr: string;
};
