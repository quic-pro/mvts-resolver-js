"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActualCurator = void 0;
const providers_1 = require("@ethersproject/providers");
const contract_interfaces_js_1 = require("@mvts/contract-interfaces-js");
const constants_1 = require("../constants");
function getActualCurator(signerOrProvider) {
    if (!signerOrProvider) {
        signerOrProvider = new providers_1.JsonRpcProvider(constants_1.DEFAULT_RPC_URLS[constants_1.ACTUAL_CURATOR_CHAIN_ID]);
    }
    return contract_interfaces_js_1.CuratorFactory.connect(constants_1.ACTUAL_CURATOR_ADDRESS, signerOrProvider);
}
exports.getActualCurator = getActualCurator;
