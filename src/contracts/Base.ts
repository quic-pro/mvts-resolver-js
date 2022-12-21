import {Contract, ContractInterface} from '@ethersproject/contracts';
import {Signer} from '@ethersproject/abstract-signer';
import {Provider} from '@ethersproject/abstract-provider';

import {address} from './types';


export default class Base {
    constructor(addressOrName: address | string, contractInterface: ContractInterface, signerOrProvider: Signer | Provider) {
        this.contract = new Contract(addressOrName, contractInterface, signerOrProvider);
    }


    // ----- [ PUBLIC PROPERTIES ] -------------------------------------------------------------------------------------

    public contract: Contract;


    // ----- [ PUBLIC METHODS ] ----------------------------------------------------------------------------------------

    public updateContract(addressOrName?: string, signerOrProvider?: Signer | Provider): void {
        if (!addressOrName) {
            addressOrName = this.contract.address;
        }
        if (!signerOrProvider) {
            signerOrProvider = this.contract.signer ?? this.contract.provider;
        }
        this.contract = new Contract(addressOrName, this.contract.interface, signerOrProvider);
    }
}
