import {BigNumber} from '@ethersproject/bignumber';


export type ContractConfig = {
    address: string;
    chainId: number;
    abi: any;
};

export type RootRouterData = {
    ttl: BigNumber;
    chainId: BigNumber;
    adr: string;
};
