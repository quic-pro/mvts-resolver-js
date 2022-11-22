import { Contract, ContractInterface } from '@ethersproject/contracts';
import { Signer } from '@ethersproject/abstract-signer';
import { Provider } from '@ethersproject/abstract-provider';
export default class Base {
    constructor(addressOrName: string, contractInterface: ContractInterface, signerOrProvider: Signer | Provider);
    contract: Contract;
    updateContract(addressOrName?: string, signerOrProvider?: Signer | Provider): void;
}
