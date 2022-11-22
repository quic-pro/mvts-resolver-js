"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RootRouter_json_1 = __importDefault(require("../abis/RootRouter.json"));
const Base_1 = __importDefault(require("./Base"));
class RootRouter extends Base_1.default {
    constructor(addressOrName, signerOrProvider) {
        super(addressOrName, RootRouter_json_1.default, signerOrProvider);
    }
    // ----- [ SETTINGS ] ----------------------------------------------------------------------------------------------
    POOL_SIZE() {
        return this.contract['POOL_SIZE']();
    }
    buyPrice() {
        return this.contract['buyPrice']();
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
    numberFreezeDuration() {
        return this.contract['numberFreezeDuration']();
    }
    ttl() {
        return this.contract['ttl']();
    }
    defaultSipDomain() {
        return this.contract['defaultSipDomain']();
    }
    // ----- [ DATA ] --------------------------------------------------------------------------------------------------
    pool(code) {
        return this.contract['pool'](code);
    }
    // ----- [ PUBLIC UTILS ] ------------------------------------------------------------------------------------------
    getTimestamp() {
        return this.contract['getTimestamp']();
    }
    isValidNumber(code) {
        return this.contract['isValidNumber'](code);
    }
    isNumberOwner(code, adr) {
        return this.contract['isNumberOwner'](code, adr);
    }
    isBlocked(code) {
        return this.contract['isBlocked'](code);
    }
    isHolded(code) {
        return this.contract['isHolded'](code);
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
    getNumberStatus(code) {
        return this.contract['getNumberStatus'](code);
    }
    getAvailableNumbers() {
        return this.contract['getBlockedNumbers']();
    }
    getHoldedNumbers() {
        return this.contract['getHoldedNumbers']();
    }
    getAvailableForBuyNumbers() {
        return this.contract['getAvailableForBuyNumbers']();
    }
    getNumberPools() {
        return this.contract['getNumberPools']();
    }
    getAddressNumbers(adr) {
        return this.contract['getAddressNumbers'](adr);
    }
    // ----- [ SMART CONTRACT MANAGEMENT ] -----------------------------------------------------------------------------
    withdraw() {
        return this.contract['withdraw']();
    }
    setBuyPrice(newBuyPrice) {
        return this.contract['setBuyPrice'](newBuyPrice);
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
    setNumberFreezeDuration(newNumberFreezeDuration) {
        return this.contract['setNumberFreezeDuration'](newNumberFreezeDuration);
    }
    setTtl(newTtl) {
        return this.contract['setTtl'](newTtl);
    }
    setDefaultSipDomain(newDefaultSipDomain) {
        return this.contract['setDefaultSipDomain'](newDefaultSipDomain);
    }
    takeAwayOwnership(code) {
        return this.contract['takeAwayOwnership'](code);
    }
    setBlockedStatus(code, newBlockedStatus) {
        return this.contract['setBlockedStatus'](code, newBlockedStatus);
    }
    setExpirationTime(code, newExpirationTime) {
        return this.contract['setExpirationTime'](code, newExpirationTime);
    }
    // ----- [ CUSTOMER NUMBER MANAGEMENT ] ----------------------------------------------------------------------------
    buy(code) {
        return this.contract['buy'](code);
    }
    renewSubscription(code) {
        return this.contract['renewSubscription'](code);
    }
    transferOwnershipOfCustomerNumber(code, newOwner) {
        return this.contract['transferOwnershipOfCustomerNumber'](code, newOwner);
    }
    renounceOwnershipOfCustomerNumber(code) {
        return this.contract['renounceOwnershipOfCustomerNumber'](code);
    }
    changeCustomerNumberMode(code) {
        return this.contract['changeCustomerNumberMode'](code);
    }
    setCustomerNumberSipDomain(code, newSipDomain) {
        return this.contract['setCustomerNumberSipDomain'](code, newSipDomain);
    }
    clearCustomerNumberSipDomain(code) {
        return this.contract['clearCustomerNumberSipDomain'](code);
    }
    setCustomerNumberRouter(code, newChainId, newAddress, newPoolCodeLength) {
        return this.contract['setCustomerNumberRouter'](code, newChainId, newAddress, newPoolCodeLength);
    }
    clearCustomerNumberRouter(code) {
        return this.contract['clearCustomerNumberRouter'](code);
    }
    // ----- [ ROUTING ] -----------------------------------------------------------------------------------------------
    getNextNode(code) {
        return this.contract['getNextNode'](code);
    }
}
exports.default = RootRouter;
