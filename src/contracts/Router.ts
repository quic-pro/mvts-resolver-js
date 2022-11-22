import {Signer} from '@ethersproject/abstract-signer';
import {Provider} from '@ethersproject/abstract-provider';
import {BigNumber} from '@ethersproject/bignumber';

import ABI from '../abis/Router.json';

import Base from './Base';


export default class Router extends Base {
    constructor(addressOrName: string, signerOrProvider: Signer | Provider) {
        super(addressOrName, ABI, signerOrProvider);
    }


    // --- [ PUBLIC METHODS ] ------------------------------------------------------------------------------------------

    public getNextNode(code: BigNumber): Promise<string[]> {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await this.contract['getNextNode'](code));
            } catch (error) {
                reject(error);
            }
        });
    }
}
