import {Signer} from '@ethersproject/abstract-signer';
import {Provider} from '@ethersproject/abstract-provider';

import ABI from '../abis/Curator.json';

import Base from './Base';


export default class Curator extends Base {
    constructor(addressOrName: string, signerOrProvider: Signer | Provider) {
        super(addressOrName, ABI, signerOrProvider);
    }


    // --- [ PUBLIC METHODS ] ------------------------------------------------------------------------------------------

    public getRootRouter(): Promise<string[]> {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await this.contract['getRootRouter']());
            } catch (error) {
                reject(error);
            }
        });
    }
}
