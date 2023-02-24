"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActualCurator = void 0;
const providers_1 = require("@ethersproject/providers");
const contract_interfaces_js_1 = require("@mvts/contract-interfaces-js");
const constants_1 = require("../constants");
function getActualCurator(signerOrProvider, testnet = false) {
    if (!signerOrProvider) {
        const rpcUrl = testnet ? constants_1.DEFAULT_TEST_RPC_URLS[constants_1.ACTUAL_TEST_CURATOR_CHAIN_ID] : constants_1.DEFAULT_RPC_URLS[constants_1.ACTUAL_CURATOR_CHAIN_ID];
        signerOrProvider = new providers_1.JsonRpcProvider(rpcUrl);
    }
    return contract_interfaces_js_1.CuratorFactory.connect(testnet ? constants_1.ACTUAL_TEST_CURATOR_ADDRESS : constants_1.ACTUAL_CURATOR_ADDRESS, signerOrProvider);
}
exports.getActualCurator = getActualCurator;
