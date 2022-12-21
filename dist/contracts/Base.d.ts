import { Contract, ContractInterface } from '@ethersproject/contracts';
import { Signer } from '@ethersproject/abstract-signer';
import { Provider } from '@ethersproject/abstract-provider';
import { address } from './types';
export default class Base {
    constructor(addressOrName: address | string, contractInterface: ContractInterface, signerOrProvider: Signer | Provider);
    contract: Contract;
    updateContract(addressOrName?: string, signerOrProvider?: Signer | Provider): void;
}
