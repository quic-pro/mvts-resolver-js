import {Contract} from '@ethersproject/contracts';
import {EtherscanProvider} from '@ethersproject/providers';

import {ABI} from '../constants/rootRouter';


export default class RootRouter {
    constructor(chainId: number, address: string) {
        this.contract = new Contract(address, ABI, new EtherscanProvider(chainId));
    }


    // --- [ PRIVATE PROPERTIES ] -------------------------------------------------------------------------------------

    private readonly contract: Contract;



    // --- [ PUBLIC METHODS ] -----------------------------------------------------------------------------------------

    public getNextNode(): Promise<void> {
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
