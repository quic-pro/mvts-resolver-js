"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Curator_json_1 = __importDefault(require("../abis/Curator.json"));
const Base_1 = __importDefault(require("./Base"));
class Curator extends Base_1.default {
    constructor(addressOrName, signerOrProvider) {
        super(addressOrName, Curator_json_1.default, signerOrProvider);
    }
    // ----- [ SETTINGS ] ----------------------------------------------------------------------------------------------
    POOL_CODE_LENGTH() {
        return this.contract['POOL_CODE_LENGTH']();
    }
    ttl() {
        return this.contract['ttl']();
    }
    // ----- [ DATA ] --------------------------------------------------------------------------------------------------
    rootRouter() {
        return this.contract['rootRouter']();
    }
    hasRootRouter() {
        return this.contract['hasRootRouter']();
    }
    // ----- [ SMART CONTRACT MANAGEMENT ] -----------------------------------------------------------------------------
    setTtl(newTtl) {
        return this.contract['setTtl'](newTtl);
    }
    setRootRouter(newChainId, newAddress) {
        return this.contract['setRootRouter'](newChainId, newAddress);
    }
    cleanRootRouter() {
        return this.contract['cleanRootRouter']();
    }
    // ----- [ ROUTING ] -----------------------------------------------------------------------------------------------
    getRootRouter() {
        return this.contract['getRootRouter']();
    }
}
exports.default = Curator;
