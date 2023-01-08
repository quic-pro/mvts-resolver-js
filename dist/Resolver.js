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
        if (options.useDefaultRpcUrls ?? true) {
            this.addProviders(constants_1.DEFAULT_RPC_URLS);
        }
        if (options.rpcUrlsAndProviders) {
            this.addProviders(options.rpcUrlsAndProviders);
        }
        this.curator = options.curator ?? (0, utils_1.getActualCurator)(this.providers.get(constants_1.ACTUAL_CURATOR_CHAIN_ID));
        this.cache = null;
        this.useCache = options.useCache ?? true;
    }
    // ----- [ PRIVATE PROPERTIES ] ------------------------------------------------------------------------------------
    cache;
    // ----- [ PROTECTED PROPERTIES ] ----------------------------------------------------------------------------------
    useCache;
    // ----- [ PUBLIC PROPERTIES ] -------------------------------------------------------------------------------------
    providers;
    curator;
    // ----- [ PRIVATE METHODS ] ---------------------------------------------------------------------------------------
    addProviders(rpcUrlsAndProviders) {
        const entries = Object.entries(rpcUrlsAndProviders);
        entries.forEach(([chainId, rpcUrlOrProvider]) => {
            if (typeof rpcUrlOrProvider === 'string') {
                this.providers.set(Number(chainId), new providers_1.JsonRpcProvider(rpcUrlOrProvider, chainId));
            }
            else {
                this.providers.set(Number(chainId), rpcUrlOrProvider);
            }
        });
    }
    // ----- [ PROTECTED METHODS ] -------------------------------------------------------------------------------------
    createCache(nodeData) {
        return {
            expirationTime: Date.now() + nodeData.ttl.toNumber() * 1000,
            nodeData,
            codes: new Map()
        };
    }
    getRootRouterData() {
        if (this.useCache && this.cache && (Date.now() < this.cache.expirationTime)) {
            return Promise.resolve(this.cache.nodeData);
        }
        return this.curator.getRootRouter()
            .then((nodeData) => {
            this.cache = this.createCache(nodeData);
            return nodeData;
        });
    }
    getRouter(router) {
        const provider = this.providers.get(router.chainId.toNumber());
        if (!provider) {
            throw new Error(`Missing provider for chain ${router.chainId}.`);
        }
        return contract_interfaces_js_1.Router__factory.connect(router.adr, provider);
    }
    // ----- [ PUBLIC METHODS ] ----------------------------------------------------------------------------------------
    getUseCache() {
        return this.useCache;
    }
    setUseCache(useCache) {
        this.useCache = useCache;
    }
    clearCache() {
        this.cache = null;
    }
    getSipUri(phoneNumber) {
        return new Promise(async (resolve, reject) => {
            let nodeData = await this.getRootRouterData();
            let routerCache = this.cache;
            let index = 0;
            while (index < phoneNumber.length) {
                const poolCodeLength = nodeData.router.poolCodeLength.toNumber();
                if (phoneNumber.length < index + poolCodeLength) {
                    reject(new Error('Phone number is wrong.'));
                }
                const code = Number(phoneNumber.substring(index, index + poolCodeLength));
                const callCache = this.useCache ? routerCache.codes.get(code) : null;
                if (callCache && (Date.now() < callCache.expirationTime)) {
                    nodeData = callCache.nodeData;
                }
                else {
                    const router = this.getRouter(nodeData.router);
                    nodeData = await router.getNodeData(code);
                    routerCache.codes.set(code, this.createCache(nodeData));
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
