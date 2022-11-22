import {Signer} from '@ethersproject/abstract-signer';
import {Provider} from '@ethersproject/abstract-provider';
import {BigNumber} from '@ethersproject/bignumber';

import ABI from '../abis/Router.json';

import Base from './Base';


export default class Router extends Base {
    constructor(addressOrName: string, signerOrProvider: Signer | Provider) {
        super(addressOrName, ABI, signerOrProvider);
    }


    // ----- [ ROUTING ] -----------------------------------------------------------------------------------------------

    public getNextNode(code: BigNumber): Promise<string[]> {
        return this.contract['getNextNode'](code);
    }
}
