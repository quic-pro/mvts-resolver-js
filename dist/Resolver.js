"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resolver = void 0;
const providers_1 = require("@ethersproject/providers");
const contract_interfaces_js_1 = require("@mvts/contract-interfaces-js");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
class Resolver {
    constructor(options = {}) {
        this.providers = new Map();
        if (options.useDefaultRpcUrls ?? true) {
            this.addProviders(options.testnet ? constants_1.DEFAULT_TEST_RPC_URLS : constants_1.DEFAULT_RPC_URLS);
        }
        if (options.rpcUrlsAndProviders) {
            this.addProviders(options.rpcUrlsAndProviders);
        }
        this.curator = options.curator ?? (0, utils_1.getActualCurator)(this.providers.get(options.testnet ? constants_1.ACTUAL_TEST_CURATOR_CHAIN_ID : constants_1.ACTUAL_CURATOR_CHAIN_ID));
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
                this.providers.set(Number(chainId), new providers_1.JsonRpcProvider(rpcUrlOrProvider));
            }
            else {
                this.providers.set(Number(chainId), rpcUrlOrProvider);
            }
        });
    }
    // ----- [ PROTECTED METHODS ] -------------------------------------------------------------------------------------
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
    createCache(nodeData) {
        return {
            expirationTime: Date.now() + nodeData.ttl.toNumber() * 1000,
            nodeData,
            codes: new Map(),
        };
    }
    async getNodeData(phoneNumber) {
        let nodeData = await this.getRootRouterData();
        let routerCache = this.cache;
        do {
            if (nodeData.mode !== 1 /* CodeMode.Pool */) {
                throw new Error('Invalid phone number: intermediate node is not a pool.');
            }
            const poolCodeLength = nodeData.router.poolCodeLength.toNumber();
            if (phoneNumber.length < poolCodeLength) {
                throw new Error('Invalid phone number: invalid length.');
            }
            const code = Number(phoneNumber.slice(0, poolCodeLength));
            if (isNaN(code)) {
                throw new Error('Invalid phone number: invalid symbols.');
            }
            phoneNumber = phoneNumber.slice(poolCodeLength);
            const codeCache = routerCache?.codes.get(code) ?? null;
            if (this.useCache && codeCache && (Date.now() < codeCache.expirationTime)) {
                nodeData = codeCache.nodeData;
            }
            else {
                const router = this.getRouter(nodeData.router);
                nodeData = await router.getNodeData(code);
                routerCache?.codes.set(code, this.createCache(nodeData));
            }
            if (!nodeData.responseCode.eq(200 /* ResponseCode.OK */)) {
                throw new Error(`Response code ${nodeData.responseCode.toString()}.`);
            }
            routerCache = routerCache?.codes.get(code) ?? null;
        } while (phoneNumber.length);
        return nodeData;
    }
    getRouter(router) {
        const provider = this.providers.get(router.chainId.toNumber());
        if (!provider) {
            throw new Error(`Missing provider for chain ${router.chainId.toString()}.`);
        }
        return contract_interfaces_js_1.RouterFactory.connect(router.adr, provider);
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
        return this.getNodeData(phoneNumber)
            .then((nodeData) => {
            if (nodeData.mode !== 0 /* CodeMode.Number */) {
                throw new Error('Invalid phone number: invalid length.');
            }
            return nodeData.sipUri;
        });
    }
}
exports.Resolver = Resolver;
