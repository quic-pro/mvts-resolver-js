import { Signer } from '@ethersproject/abstract-signer';
import { Provider } from '@ethersproject/abstract-provider';
import { BigNumber } from '@ethersproject/bignumber';
import Base from './Base';
type RootRouter = {
    0: string;
    1: string;
    chainId: string;
    adr: string;
};
export default class Curator extends Base {
    constructor(addressOrName: string, signerOrProvider: Signer | Provider);
    POOL_CODE_LENGTH(): Promise<BigNumber>;
    ttl(): Promise<string>;
    rootRouter(): Promise<RootRouter>;
    hasRootRouter(): Promise<boolean>;
    setTtl(newTtl: BigNumber): Promise<void>;
    setRootRouter(newChainId: BigNumber, newAddress: string): Promise<void>;
    cleanRootRouter(): Promise<void>;
    getRootRouter(): Promise<string[]>;
}
export {};
