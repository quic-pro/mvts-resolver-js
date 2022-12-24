"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const providers_1 = require("@ethersproject/providers");
const bignumber_1 = require("@ethersproject/bignumber");
const contracts_1 = require("./contracts");
const constants_1 = require("./constants");
class Resolver {
    constructor(curator, options) {
        this.providers = new Map();
        if (!options || !options.useOnlyCustomProviders) {
            const entries = Object.entries(constants_1.DEFAULT_RPC_URLS);
            entries.forEach(([chainId, url]) => this.providers.set(Number(chainId), new providers_1.JsonRpcProvider(url)));
        }
        if (options && options.customProviders) {
            const entries = Object.entries(options.customProviders);
            entries.forEach(([chainId, provider]) => this.providers.set(Number(chainId), provider));
        }
        if (!curator) {
            const provider = this.providers.get(constants_1.ACTUAL_CURATOR_CHAIN_ID);
            if (!provider) {
                throw new Error(`Chain ${constants_1.ACTUAL_CURATOR_CHAIN_ID} not supported: provider is missing.`);
            }
            curator = new contracts_1.Curator(constants_1.ACTUAL_CURATOR_ADDRESS, provider);
        }
        this.curator = curator;
        this.router = null;
        this.curatorCache = {
            getRootRouter: {
                expirationTime: 0,
                response: []
            }
        };
        this.rootRouterCache = {
            getNextNode: new Map(),
            childRouters: new Map()
        };
    }
    // ----- [ PRIVATE PROPERTIES ] ------------------------------------------------------------------------------------
    providers;
    curator;
    curatorCache;
    rootRouterCache;
    router;
    // ----- [ STATIC PRIVATE METHODS ] --------------------------------------------------------------------------------
    static responsesIdentical(a, b) {
        if (a.length != b.length) {
            return false;
        }
        for (let i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }
    static updateRouterCache(routerCache, code, response) {
        routerCache.getNextNode.set(code, {
            expirationTime: Date.now() + Number(response[4]) * 1000,
            response: response
        });
        if (response[1] !== '0') {
            routerCache.childRouters.set(code, {
                getNextNode: new Map(),
                childRouters: new Map()
            });
        }
    }
    // ----- [ PRIVATE METHODS ] ---------------------------------------------------------------------------------------
    getRootRouterData() {
        const cache = this.curatorCache.getRootRouter;
        if ((Date.now() < cache.expirationTime) && (cache.response[0] === '200')) {
            return Promise.resolve(cache.response);
        }
        return new Promise((resolve, reject) => {
            this.curator.getRootRouter()
                .then((rootRouterData) => {
                cache.expirationTime = Date.now() + Number(rootRouterData[4]) * 1000;
                if (!Resolver.responsesIdentical(cache.response, rootRouterData)) {
                    this.rootRouterCache.getNextNode.clear();
                    this.rootRouterCache.childRouters.clear();
                    cache.response = rootRouterData;
                }
                if (rootRouterData[0] === '200') {
                    resolve(rootRouterData);
                }
                else {
                    reject(rootRouterData);
                }
            })
                .catch(reject);
        });
    }
    getRouter(chainId, address) {
        const provider = this.providers.get(chainId);
        if (!provider) {
            throw new Error(`Chain ${constants_1.ACTUAL_CURATOR_CHAIN_ID} not supported: provider is missing.`);
        }
        if (!this.router) {
            this.router = new contracts_1.Router(address, provider);
        }
        else {
            this.router.updateContract(address, provider);
        }
        return this.router;
    }
    getNextNodeData(nodeData, code) {
        const router = this.getRouter(Number(nodeData[2]), nodeData[3]);
        return router.getNextNode(bignumber_1.BigNumber.from(code));
    }
    // ----- [ PUBLIC METHODS ] ----------------------------------------------------------------------------------------
    getPhoneNumberData(phoneNumber) {
        return new Promise(async (resolve, reject) => {
            let nodeData = await this.getRootRouterData();
            let routerCache = this.rootRouterCache;
            let index = 0;
            while (index < phoneNumber.length) {
                const poolCodeLength = Number(nodeData[1]);
                if (phoneNumber.length < index + poolCodeLength) {
                    reject(['400', '', '', '', '']);
                }
                const code = Number(phoneNumber.substring(index, index + poolCodeLength));
                const callCache = routerCache.getNextNode.get(code);
                if (callCache && (Date.now() < callCache.expirationTime)) {
                    nodeData = callCache.response;
                }
                else {
                    nodeData = await this.getNextNodeData(nodeData, code);
                    Resolver.updateRouterCache(routerCache, code, nodeData);
                }
                if (nodeData[0] !== '200') {
                    reject(nodeData);
                }
                // @ts-ignore
                routerCache = routerCache.childRouters.get(code);
                index += poolCodeLength;
            }
            resolve(nodeData);
        });
    }
}
exports.default = Resolver;
