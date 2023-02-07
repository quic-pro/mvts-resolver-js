"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActualRootRouter = void 0;
const providers_1 = require("@ethersproject/providers");
const contract_interfaces_js_1 = require("@mvts/contract-interfaces-js");
const constants_1 = require("../constants");
const getActualCurator_1 = require("./getActualCurator");
function getActualRootRouter(getSignerOrProvider) {
    const curator = (0, getActualCurator_1.getActualCurator)();
    return curator.getRootRouter()
        .then(({ responseCode, router }) => {
        if (!responseCode.eq(200 /* ResponseCode.OK */)) {
            throw new Error(`Response code ${responseCode.toString()}.`);
        }
        if (!getSignerOrProvider) {
            getSignerOrProvider = (chainId) => new providers_1.JsonRpcProvider(constants_1.DEFAULT_RPC_URLS[chainId]);
        }
        return contract_interfaces_js_1.RootRouterFactory.connect(router.adr, getSignerOrProvider(router.chainId.toNumber()));
    });
}
exports.getActualRootRouter = getActualRootRouter;
