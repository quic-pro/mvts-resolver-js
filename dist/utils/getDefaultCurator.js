"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const providers_1 = require("@ethersproject/providers");
const contracts_1 = require("../contracts");
const constants_1 = require("../constants");
function getDefaultCurator() {
    const provider = new providers_1.JsonRpcProvider(constants_1.DEFAULT_RPC_URLS[constants_1.DEFAULT_CURATOR_CHAIN_ID]);
    return new contracts_1.Curator(constants_1.DEFAULT_CURATOR_ADDRESS, provider);
}
exports.default = getDefaultCurator;
