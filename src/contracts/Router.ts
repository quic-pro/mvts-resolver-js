import {Contract} from '@ethersproject/contracts';
import {EtherscanProvider} from '@ethersproject/providers';
import {BigNumber} from '@ethersproject/bignumber';

import {ABI} from '../constants/router';


export default class Router {
    constructor(chainId: number, address: string) {
        this.contract = new Contract(address, ABI, new EtherscanProvider(chainId));
    }


    // --- [ PRIVATE PROPERTIES ] -------------------------------------------------------------------------------------

    private contract: Contract;



    // --- [ PUBLIC METHODS ] -----------------------------------------------------------------------------------------

    public updateContract(chainId: number, address: string): void {
        this.contract = new Contract(address, ABI, new EtherscanProvider(chainId));
    }

    public getNextNode(code: number): Promise<string[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const rootRouter = await this.contract['getNextNode'](BigNumber.from(code));
                resolve(rootRouter);
            } catch(error) {
                reject(error);
            }
        });
    }
}
