import { Signer } from '@ethersproject/abstract-signer';
import { Provider } from '@ethersproject/abstract-provider';
import { BigNumber } from '@ethersproject/bignumber';
import Base from './Base';
type CustomerNumberMode = number;
type Router = {
    0: string;
    1: string;
    2: string;
    chainId: string;
    adr: string;
    poolCodeLength: string;
};
type CustomerNumber = {
    0: boolean;
    1: boolean;
    2: boolean;
    3: string;
    4: BigNumber;
    5: CustomerNumberMode;
    6: string;
    7: Router;
    isBlocked: boolean;
    hasSipDomain: boolean;
    hasRouter: boolean;
    owner: string;
    subscriptionEndTime: BigNumber;
    mode: CustomerNumberMode;
    sipDomain: string;
    router: Router;
};
type NumberStatus = {
    0: boolean;
    1: boolean;
    2: boolean;
    3: boolean;
    4: BigNumber;
    5: BigNumber;
    isBlocked: boolean;
    isAvailable: boolean;
    isHolded: boolean;
    isAvailableForBuy: boolean;
    subscriptionEndTime: BigNumber;
    holdingEndTime: BigNumber;
};
export default class RootRouter extends Base {
    constructor(addressOrName: string, signerOrProvider: Signer | Provider);
    POOL_SIZE(): Promise<BigNumber>;
    buyPrice(): Promise<BigNumber>;
    subscriptionPrice(): Promise<BigNumber>;
    modeChangePrice(): Promise<BigNumber>;
    subscriptionDuration(): Promise<BigNumber>;
    numberFreezeDuration(): Promise<BigNumber>;
    ttl(): Promise<string>;
    defaultSipDomain(): Promise<string>;
    pool(code: BigNumber): Promise<CustomerNumber>;
    getTimestamp(): Promise<BigNumber>;
    isValidNumber(code: BigNumber): Promise<boolean>;
    isNumberOwner(code: BigNumber, adr: string): Promise<boolean>;
    isBlocked(code: BigNumber): Promise<boolean>;
    isHolded(code: BigNumber): Promise<boolean>;
    isAvailableForBuy(code: BigNumber): Promise<boolean>;
    isNumberMode(code: BigNumber): Promise<boolean>;
    isPoolMode(code: BigNumber): Promise<boolean>;
    getMode(code: BigNumber): Promise<CustomerNumberMode>;
    getNumberStatus(code: BigNumber): Promise<NumberStatus>;
    getAvailableNumbers(): Promise<boolean[]>;
    getHoldedNumbers(): Promise<boolean[]>;
    getAvailableForBuyNumbers(): Promise<boolean[]>;
    getNumberPools(): Promise<boolean[]>;
    getAddressNumbers(adr: string): Promise<boolean[]>;
    withdraw(): Promise<void>;
    setBuyPrice(newBuyPrice: BigNumber): Promise<void>;
    setSubscriptionPrice(newSubscriptionPrice: BigNumber): Promise<void>;
    setModeChangePrice(newModeChangePrice: BigNumber): Promise<void>;
    setSubscriptionDuration(newSubscriptionDuration: BigNumber): Promise<void>;
    setNumberFreezeDuration(newNumberFreezeDuration: BigNumber): Promise<void>;
    setTtl(newTtl: BigNumber): Promise<void>;
    setDefaultSipDomain(newDefaultSipDomain: string): Promise<void>;
    takeAwayOwnership(code: BigNumber): Promise<void>;
    setBlockedStatus(code: BigNumber, newBlockedStatus: boolean): Promise<void>;
    setExpirationTime(code: BigNumber, newExpirationTime: BigNumber): Promise<void>;
    buy(code: BigNumber): Promise<void>;
    renewSubscription(code: BigNumber): Promise<string[]>;
    transferOwnershipOfCustomerNumber(code: BigNumber, newOwner: string): Promise<string[]>;
    renounceOwnershipOfCustomerNumber(code: BigNumber): Promise<string[]>;
    changeCustomerNumberMode(code: BigNumber): Promise<string[]>;
    setCustomerNumberSipDomain(code: BigNumber, newSipDomain: string): Promise<string[]>;
    clearCustomerNumberSipDomain(code: BigNumber): Promise<string[]>;
    setCustomerNumberRouter(code: BigNumber, newChainId: BigNumber, newAddress: string, newPoolCodeLength: BigNumber): Promise<string[]>;
    clearCustomerNumberRouter(code: BigNumber): Promise<string[]>;
    getNextNode(code: BigNumber): Promise<string[]>;
}
export {};
