"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contracts_1 = require("@ethersproject/contracts");
class Base {
    constructor(addressOrName, contractInterface, signerOrProvider) {
        this.contract = new contracts_1.Contract(addressOrName, contractInterface, signerOrProvider);
    }
    // ----- [ PUBLIC PROPERTIES ] -------------------------------------------------------------------------------------
    contract;
    // ----- [ PUBLIC METHODS ] ----------------------------------------------------------------------------------------
    updateContract(addressOrName, signerOrProvider) {
        if (!addressOrName) {
            addressOrName = this.contract.address;
        }
        if (!signerOrProvider) {
            signerOrProvider = this.contract.signer ?? this.contract.provider;
        }
        this.contract = new contracts_1.Contract(addressOrName, this.contract.interface, signerOrProvider);
    }
}
exports.default = Base;
