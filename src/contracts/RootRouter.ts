import { BigNumber } from '@ethersproject/bignumber';
import {Contract} from '@ethersproject/contracts';
import {EtherscanProvider} from '@ethersproject/providers';

import {ABI} from '../constants/rootRouter';


export default class RootRouter {
    constructor(chainId: number, address: string) {
        this.contract = new Contract(address, ABI, new EtherscanProvider(chainId));
    }


    // --- [ PRIVATE PROPERTIES ] -------------------------------------------------------------------------------------

    private contract: Contract;



    // --- [ PUBLIC METHODS ] -----------------------------------------------------------------------------------------

    public updateContract(chainId: number, address: string): RootRouter {
        try {
            this.contract = new Contract(address, ABI, new EtherscanProvider(chainId));
        } catch (error) {}

        return this;
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
