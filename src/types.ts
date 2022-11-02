import {BigNumber} from '@ethersproject/bignumber';


export type Router = {
    ttl: BigNumber;
    chainId: BigNumber;
    adr: string;
};
