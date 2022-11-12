import {Contract} from '@ethersproject/contracts';
import {EtherscanProvider} from '@ethersproject/providers';

import {DEFAULT_ADDRESS, DEFAULT_ABI, DEFAULT_CHAIN_ID} from '../constants/curator';

import {ContractConfig, RootRouterData} from './types';


export default class Curator {
    constructor(config?: Partial<ContractConfig>) {
        this.contract = new Contract(
            config?.address ?? DEFAULT_ADDRESS,
            config?.abi ?? DEFAULT_ABI,
            new EtherscanProvider(config?.chainId ?? DEFAULT_CHAIN_ID) // TODO: Replace EtherscanProvider to JsonRpcProvider
        );
    }


    // --- [ PRIVATE PROPERTIES ] --------------------------------------------------------------------------------------

    private readonly contract: Contract;


    // --- [ PUBLIC METHODS ] ------------------------------------------------------------------------------------------

    public rootRouter(): Promise<RootRouterData> {
        return new Promise(async (resolve, reject) => {
            try {
                const rootRouter = (await this.contract['rootRouter']()) as RootRouterData;
                resolve(rootRouter);
            } catch (error) {
                reject(error);
            }
        });
    }
}
