import {Contract} from '@ethersproject/contracts';
import {JsonRpcProvider} from '@ethersproject/providers';
import {BigNumber} from '@ethersproject/bignumber';

import {DEFAULT_ABI} from '../constants/rootRouter';
import getRpc from '../utils/getRpc';


export default class RootRouter {
    constructor(abi?: any) {
        this.contract = new Contract(
            '0x0000000000000000000000000000000000000000',
            abi ?? DEFAULT_ABI
        );
    }


    // --- [ PRIVATE PROPERTIES ] -------------------------------------------------------------------------------------

    private contract: Contract;


    // --- [ PUBLIC METHODS ] -----------------------------------------------------------------------------------------

    public updateContract(chainId: number, address: string): void {
        this.contract = new Contract(address, this.contract.interface, new JsonRpcProvider(getRpc(chainId)));
    }

    public getNextNode(code: number): Promise<string[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const rootRouter = (await this.contract['getNextNode'](BigNumber.from(code))) as string[];
                resolve(rootRouter);
            } catch (error) {
                reject(error);
            }
        });
    }
}
