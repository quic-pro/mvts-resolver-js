"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Router_json_1 = __importDefault(require("../abis/Router.json"));
const Base_1 = __importDefault(require("./Base"));
class Router extends Base_1.default {
    constructor(addressOrName, signerOrProvider) {
        super(addressOrName, Router_json_1.default, signerOrProvider);
    }
    // ----- [ ROUTING ] -----------------------------------------------------------------------------------------------
    getNextNode(code) {
        return this.contract['getNextNode'](code);
    }
}
exports.default = Router;
