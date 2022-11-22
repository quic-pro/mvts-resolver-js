import {Signer} from '@ethersproject/abstract-signer';
import {Provider} from '@ethersproject/abstract-provider';
import {BigNumber} from '@ethersproject/bignumber';

import ABI from '../abis/Curator.json';

import Base from './Base';


type RootRouter = {
    0: string;
    1: string;
    chainId: string; // 0
    adr: string; // 1
};


export default class Curator extends Base {
    constructor(addressOrName: string, signerOrProvider: Signer | Provider) {
        super(addressOrName, ABI, signerOrProvider);
    }


    // ----- [ SETTINGS ] ----------------------------------------------------------------------------------------------

    public POOL_CODE_LENGTH(): Promise<BigNumber> {
        return this.contract['POOL_CODE_LENGTH']();
    }

    public ttl(): Promise<string> {
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

    public setTtl(newTtl: BigNumber): Promise<void> {
        return this.contract['setTtl'](newTtl);
    }

    public setRootRouter(newChainId: BigNumber, newAddress: string): Promise<void> {
        return this.contract['setRootRouter'](newChainId, newAddress);
    }

    public cleanRootRouter(): Promise<void> {
        return this.contract['cleanRootRouter']();
    }


    // ----- [ ROUTING ] -----------------------------------------------------------------------------------------------

    public getRootRouter(): Promise<string[]> {
        return this.contract['getRootRouter']();
    }
}
