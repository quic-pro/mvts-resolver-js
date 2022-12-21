import {Signer} from '@ethersproject/abstract-signer';
import {Provider} from '@ethersproject/abstract-provider';

import ABI from '../abis/Curator.json';

import Base from './Base';
import {address, uint256} from './types';


type RootRouter = {
    0: string; // chainId
    1: address; // adr
    chainId: string; // 0
    adr: address; // 1
};


export default class Curator extends Base {
    constructor(addressOrName: address | string, signerOrProvider: Signer | Provider) {
        super(addressOrName, ABI, signerOrProvider);
    }


    // ----- [ SETTINGS ] ----------------------------------------------------------------------------------------------

    public POOL_CODE_LENGTH(): Promise<string> {
        return this.contract['POOL_CODE_LENGTH']();
    }

    public ttl(): Promise<uint256> {
        return this.contract['ttl']();
    }


    // ----- [ DATA ] --------------------------------------------------------------------------------------------------

    public rootRouter(): Promise<RootRouter> {
        return this.contract['rootRouter']();
    }

    public hasRootRouter(): Promise<boolean> {
        return this.contract['hasRootRouter']();
    }


    // ----- [ SMART CONTRACT MANAGEMENT ] -----------------------------------------------------------------------------

    public setTtl(newTtl: uint256): Promise<void> {
        return this.contract['setTtl'](newTtl);
    }

    public setRootRouter(newChainId: uint256, newAdr: address): Promise<void> {
        return this.contract['setRootRouter'](newChainId, newAdr);
    }

    public cleanRootRouter(): Promise<void> {
        return this.contract['cleanRootRouter']();
    }


    // ----- [ ROUTING ] -----------------------------------------------------------------------------------------------

    public getRootRouter(): Promise<string[]> {
        return this.contract['getRootRouter']();
    }
}
