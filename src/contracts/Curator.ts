import {Contract} from '@ethersproject/contracts';
import {EtherscanProvider} from '@ethersproject/providers';

import {ADDRESS, ABI, CHAIN_ID} from '../constants/curator';

import {Router} from '../types';


export default class Curator {
    constructor() {
        this.contract = new Contract(ADDRESS, ABI, new EtherscanProvider(CHAIN_ID));
    }


    // --- [ PRIVATE PROPERTIES ] -------------------------------------------------------------------------------------

    private readonly contract: Contract;



    // --- [ PUBLIC METHODS ] -----------------------------------------------------------------------------------------

    public rootRouter(): Promise<Router> {
        return new Promise(async (resolve, reject) => {
            try {
                const rootRouter = await this.contract['rootRouter']();
                resolve(rootRouter);
            } catch(error) {
                reject(error);
            }
        });
    }
}
