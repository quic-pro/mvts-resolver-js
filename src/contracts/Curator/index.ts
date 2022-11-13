import {Contract} from '@ethersproject/contracts';
import {JsonRpcProvider} from '@ethersproject/providers';

import {DEFAULT_ADDRESS, ABI, DEFAULT_CHAIN_ID} from '../../constants/curator';
import {DEFAULT_RPC_URLS} from '../../constants/rpc';

import {CuratorConfig, RootRouterData} from './types';


const DefaultConfig: CuratorConfig = {
    chainId: DEFAULT_CHAIN_ID,
    address: DEFAULT_ADDRESS
};


export default class Curator {
    constructor(config = DefaultConfig, rpcUrls = DEFAULT_RPC_URLS) {
        if (!rpcUrls[config.chainId]) {
            throw new Error(`Chain ${config.chainId} not supported`);
        }

        this.contract = new Contract(config.address, ABI, new JsonRpcProvider(rpcUrls[config.chainId]));
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
