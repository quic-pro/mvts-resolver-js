import {Interface} from "@ethersproject/abi"
import {Contract} from '@ethersproject/contracts';
import {JsonRpcProvider} from '@ethersproject/providers';
import {BigNumber} from '@ethersproject/bignumber';

import {ABI} from '../../constants/router';
import {DEFAULT_RPC_URLS} from '../../constants/rpc';


export default class Router {
    constructor(rpcUrls = DEFAULT_RPC_URLS) {
        this.interface = new Interface(ABI);
        this.providers = new Map(Object.entries(rpcUrls).map(([chainId, rpcUrl]) => [+chainId, new JsonRpcProvider(rpcUrl)]));
    }


    // --- [ PRIVATE PROPERTIES ] -------------------------------------------------------------------------------------

    private readonly providers: Map<number, JsonRpcProvider>;
    private readonly interface: Interface;
    private contract: Contract;


    // --- [ PUBLIC METHODS ] -----------------------------------------------------------------------------------------

    public updateContract(chainId: number, address: string): void {
        const provider = this.providers.get(chainId);
        if (!provider) {
            throw new Error(`Chain ${chainId} not supported`);
        }

        this.contract = new Contract(address, this.interface, provider);
    }

    public getNextNode(code: number): Promise<string[]> {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await this.contract['getNextNode'](BigNumber.from(code)));
            } catch (error) {
                reject(error);
            }
        });
    }
}
