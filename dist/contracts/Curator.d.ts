import { Signer } from '@ethersproject/abstract-signer';
import { Provider } from '@ethersproject/abstract-provider';
import Base from './Base';
import { address, uint256 } from './types';
type RootRouter = {
    0: string;
    1: address;
    chainId: string;
    adr: address;
};
export default class Curator extends Base {
    constructor(addressOrName: address | string, signerOrProvider: Signer | Provider);
    POOL_CODE_LENGTH(): Promise<string>;
    ttl(): Promise<uint256>;
    rootRouter(): Promise<RootRouter>;
    hasRootRouter(): Promise<boolean>;
    setTtl(newTtl: uint256): Promise<void>;
    setRootRouter(newChainId: uint256, newAdr: address): Promise<void>;
    cleanRootRouter(): Promise<void>;
    getRootRouter(): Promise<string[]>;
}
export {};
