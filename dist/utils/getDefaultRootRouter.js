"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const providers_1 = require("@ethersproject/providers");
const contracts_1 = require("../contracts");
const constants_1 = require("../constants");
const getDefaultCurator_1 = __importDefault(require("./getDefaultCurator"));
function getDefaultRootRouter() {
    return new Promise((resolve, reject) => {
        const curator = (0, getDefaultCurator_1.default)();
        curator.getRootRouter()
            .then((rootRouterData) => {
            const responseCode = rootRouterData[0];
            if (responseCode != '200') {
                reject(rootRouterData);
            }
            const chainId = Number(rootRouterData[2]);
            const adr = rootRouterData[3];
            const provider = new providers_1.JsonRpcProvider(constants_1.DEFAULT_RPC_URLS[chainId]);
            const rootRouter = new contracts_1.RootRouter(adr, provider);
            resolve(rootRouter);
        })
            .catch(reject);
    });
}
exports.default = getDefaultRootRouter;
