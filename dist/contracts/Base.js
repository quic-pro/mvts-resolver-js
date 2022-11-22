"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contracts_1 = require("@ethersproject/contracts");
class Base {
    constructor(addressOrName, contractInterface, signerOrProvider) {
        this.contract = new contracts_1.Contract(addressOrName, contractInterface, signerOrProvider);
    }
    // ----- [ PUBLIC METHODS ] ----------------------------------------------------------------------------------------
    updateContract(addressOrName, signerOrProvider) {
        var _a;
        if (!addressOrName) {
            addressOrName = this.contract.address;
        }
        if (!signerOrProvider) {
            signerOrProvider = (_a = this.contract.signer) !== null && _a !== void 0 ? _a : this.contract.provider;
        }
        this.contract = new contracts_1.Contract(addressOrName, this.contract.interface, signerOrProvider);
    }
}
exports.default = Base;
