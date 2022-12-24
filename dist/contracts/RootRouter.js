"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RootRouter_json_1 = __importDefault(require("../abis/RootRouter.json"));
const Base_1 = __importDefault(require("./Base"));
var CodeMode;
(function (CodeMode) {
    CodeMode[CodeMode["Number"] = 0] = "Number";
    CodeMode[CodeMode["Pool"] = 1] = "Pool";
})(CodeMode || (CodeMode = {}));
class RootRouter extends Base_1.default {
    constructor(addressOrName, signerOrProvider) {
        super(addressOrName, RootRouter_json_1.default, signerOrProvider);
    }
    // ----- [ SETTINGS ] ----------------------------------------------------------------------------------------------
    mintPrice() {
        return this.contract['mintPrice']();
    }
    subscriptionPrice() {
        return this.contract['subscriptionPrice']();
    }
    modeChangePrice() {
        return this.contract['modeChangePrice']();
    }
    subscriptionDuration() {
        return this.contract['subscriptionDuration']();
    }
    holdingDuration() {
        return this.contract['holdingDuration']();
    }
    ttl() {
        return this.contract['ttl']();
    }
    baseUri() {
        return this.contract['baseUri']();
    }
    defaultSipDomain() {
        return this.contract['defaultSipDomain']();
    }
    // ----- [ DATA ] --------------------------------------------------------------------------------------------------
    owner() {
        return this.contract['owner']();
    }
    name() {
        return this.contract['name']();
    }
    symbol() {
        return this.contract['symbol']();
    }
    POOL_SIZE() {
        return this.contract['POOL_SIZE']();
    }
    // ----- [ PUBLIC UTILS ] ------------------------------------------------------------------------------------------
    supportsInterface(interfaceId) {
        return this.contract['supportsInterface'](interfaceId);
    }
    tokenURI(tokenId) {
        return this.contract['tokenURI'](tokenId);
    }
    balanceOf(owner) {
        return this.contract['balanceOf'](owner);
    }
    ownerOf(tokenId) {
        return this.contract['ownerOf'](tokenId);
    }
    hasOwner(code) {
        return this.contract['hasOwner'](code);
    }
    getCodeData(code) {
        return this.contract['getCodeData'](code);
    }
    isBlocked(code) {
        return this.contract['isBlocked'](code);
    }
    isHeld(code) {
        return this.contract['isHeld'](code);
    }
    isAvailableForBuy(code) {
        return this.contract['isAvailableForBuy'](code);
    }
    isNumberMode(code) {
        return this.contract['isNumberMode'](code);
    }
    isPoolMode(code) {
        return this.contract['isPoolMode'](code);
    }
    getMode(code) {
        return this.contract['getMode'](code);
    }
    getCodeStatus(code) {
        return this.contract['getCodeStatus'](code);
    }
    getBlockedCodes() {
        return this.contract['getBlockedCodes']();
    }
    getHeldCodes() {
        return this.contract['getHeldCodes']();
    }
    getAvailableForMintCodes() {
        return this.contract['getAvailableForMintCodes']();
    }
    getPoolCodes() {
        return this.contract['getPoolCodes']();
    }
    getOwnerCodes(adr) {
        return this.contract['getOwnerCodes'](adr);
    }
    // ----- [ SMART CONTRACT MANAGEMENT ] -----------------------------------------------------------------------------
    withdraw() {
        return this.contract['withdraw']();
    }
    setMintPrice(newMintPrice) {
        return this.contract['setMintPrice'](newMintPrice);
    }
    setSubscriptionPrice(newSubscriptionPrice) {
        return this.contract['setSubscriptionPrice'](newSubscriptionPrice);
    }
    setModeChangePrice(newModeChangePrice) {
        return this.contract['setModeChangePrice'](newModeChangePrice);
    }
    setSubscriptionDuration(newSubscriptionDuration) {
        return this.contract['setSubscriptionDuration'](newSubscriptionDuration);
    }
    setHoldingDuration(newHoldingDuration) {
        return this.contract['setHoldingDuration'](newHoldingDuration);
    }
    setTtl(newTtl) {
        return this.contract['setTtl'](newTtl);
    }
    setDefaultSipDomain(newDefaultSipDomain) {
        return this.contract['setDefaultSipDomain'](newDefaultSipDomain);
    }
    setBaseUri(newBaseUri) {
        return this.contract['setBaseUri'](newBaseUri);
    }
    setCodeBlockedStatus(code, newBlockedStatus) {
        return this.contract['setCodeBlockedStatus'](code, newBlockedStatus);
    }
    setCodeSubscriptionEndTime(code, newSubscriptionEndTime) {
        return this.contract['setCodeSubscriptionEndTime'](code, newSubscriptionEndTime);
    }
    // ----- [ CODE MANAGEMENT ] ---------------------------------------------------------------------------------------
    safeTransferFrom(from, to, tokenId, data) {
        return this.contract['safeTransferFrom(address,address,uint256,bytes)'](from, to, tokenId, data);
    }
    transferFrom(from, to, tokenId) {
        return this.contract['transferFrom'](from, to, tokenId);
    }
    approve(to, tokenId) {
        return this.contract['approve'](to, tokenId);
    }
    setApprovalForAll(operator, approved) {
        return this.contract['setApprovalForAll'](operator, approved);
    }
    getApproved(tokenId) {
        return this.contract['getApproved'](tokenId);
    }
    isApprovedForAll(owner, operator) {
        return this.contract['isApprovedForAll'](owner, operator);
    }
    mint(code, options) {
        return this.contract['mint'](code, options);
    }
    renewSubscription(code, options) {
        return this.contract['renewSubscription'](code, options);
    }
    transferOwnershipOfCode(code, newOwner) {
        return this.contract['transferOwnershipOfCode'](code, newOwner);
    }
    renounceOwnershipOfCode(code) {
        return this.contract['renounceOwnershipOfCode'](code);
    }
    changeCodeMode(code) {
        return this.contract['changeCodeMode'](code);
    }
    setCodeSipDomain(code, newSipDomain) {
        return this.contract['setCodeSipDomain'](code, newSipDomain);
    }
    clearCodeSipDomain(code) {
        return this.contract['clearCodeSipDomain'](code);
    }
    setCodeRouter(code, newChainId, newAdr, newPoolCodeLength) {
        return this.contract['setCodeRouter'](code, newChainId, newAdr, newPoolCodeLength);
    }
    clearCodeRouter(code) {
        return this.contract['clearCodeRouter'](code);
    }
    // ----- [ ROUTING ] -----------------------------------------------------------------------------------------------
    getNextNode(code) {
        return this.contract['getNextNode'](code);
    }
}
exports.default = RootRouter;
