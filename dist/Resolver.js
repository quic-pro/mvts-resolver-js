"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resolver = void 0;
const providers_1 = require("@ethersproject/providers");
const contract_interfaces_js_1 = require("@mvts/contract-interfaces-js");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const types_1 = require("./types");
class Resolver {
    constructor(options = {}) {
        this.providers = new Map();
        if (options.useDefaultRpcUrls) {
            const entries = Object.entries(constants_1.DEFAULT_RPC_URLS);
            entries.forEach(([chainId, rpcUrl]) => this.providers.set(Number(chainId), new providers_1.JsonRpcProvider(rpcUrl)));
        }
        if (options.rpcUrlsAndProviders) {
            const entries = Object.entries(options.rpcUrlsAndProviders);
            entries.forEach(([chainId, rpcUrlOrProvider]) => {
                if (typeof rpcUrlOrProvider === 'string') {
                    this.providers.set(Number(chainId), new providers_1.JsonRpcProvider(rpcUrlOrProvider, chainId));
                }
                else {
                    this.providers.set(Number(chainId), rpcUrlOrProvider);
                }
            });
        }
        if (options.curator) {
            this.curator = options.curator;
        }
        else {
            this.curator = (0, utils_1.getActualCurator)(this.providers.get(constants_1.ACTUAL_CURATOR_CHAIN_ID));
        }
        this.cache = null;
        this.useCache = options.useCache ?? true;
    }
    // ----- [ PRIVATE PROPERTIES ] ------------------------------------------------------------------------------------
    cache;
    useCache;
    // ----- [ PUBLIC PROPERTIES ] -------------------------------------------------------------------------------------
    providers;
    curator;
    // ----- [ PRIVATE METHODS ] ---------------------------------------------------------------------------------------
    getRootRouterData() {
        if (this.cache && (Date.now() < this.cache.expirationTime)) {
            return Promise.resolve(this.cache.nodeData);
        }
        return new Promise((resolve, reject) => {
            this.curator.getRootRouter()
                .then((nodeData) => {
                this.cache = {
                    expirationTime: Date.now() + nodeData.ttl.toNumber() * 1000,
                    nodeData,
                    codes: new Map()
                };
                if (nodeData.responseCode.eq(types_1.ResponseCode.OK)) {
                    resolve(this.cache.nodeData);
                }
                else {
                    reject(new Error('Failed to get node data.'));
                }
            })
                .catch(reject);
        });
    }
    getRouter(router) {
        const provider = this.providers.get(router.chainId.toNumber());
        if (!provider) {
            throw new Error(`Chain ${constants_1.ACTUAL_CURATOR_CHAIN_ID} not supported: provider is missing.`);
        }
        return contract_interfaces_js_1.Router__factory.connect(router.adr, provider);
    }
    // ----- [ PUBLIC METHODS ] ----------------------------------------------------------------------------------------
    getSipUri(phoneNumber) {
        return new Promise(async (resolve, reject) => {
            let nodeData = await this.getRootRouterData();
            let routerCache = this.cache;
            let index = 0;
            while (index < phoneNumber.length) {
                const poolCodeLength = nodeData.router.poolCodeLength.toNumber();
                if (phoneNumber.length < index + poolCodeLength) {
                    reject(new Error(''));
                }
                const code = Number(phoneNumber.substring(index, index + poolCodeLength));
                const callCache = this.useCache ? routerCache.codes.get(code) : null;
                if (callCache && (Date.now() < callCache.expirationTime)) {
                    nodeData = callCache.nodeData;
                }
                else {
                    const router = this.getRouter(nodeData.router);
                    nodeData = await router.getNodeData(code);
                    routerCache.codes.set(code, {
                        expirationTime: Date.now() + nodeData.ttl.toNumber() * 1000,
                        nodeData,
                        codes: new Map()
                    });
                }
                if (!nodeData.responseCode.eq(types_1.ResponseCode.OK)) {
                    reject(nodeData);
                }
                // @ts-ignore
                routerCache = routerCache.codes.get(code);
                index += poolCodeLength;
            }
            resolve(nodeData.sipUri);
        });
    }
}
exports.Resolver = Resolver;
