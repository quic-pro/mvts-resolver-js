import {Contract} from '@ethersproject/contracts';
import {EtherscanProvider} from '@ethersproject/providers';

import {ADDRESS, ABI, CHAIN_ID} from './constants/guardian';

import {Router} from './types';


export default class Guardian {
    constructor() {
        this.contract = new Contract(ADDRESS, ABI, new EtherscanProvider(CHAIN_ID));
    }

    private readonly contract: Contract;


    public rootRouter(): Promise<Router> {
        return new Promise(async (resolve, reject) => {
            try {
                const answer = await this.contract['rootRouter']();
                resolve({
                    chainId: answer.chainId,
                    adr: answer.adr,
                    poolCodeLength: answer.poolCodeLength
                });
            } catch(error) {
                reject(error);
            }
        });
    }
}
