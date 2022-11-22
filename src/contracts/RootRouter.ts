import {Signer} from '@ethersproject/abstract-signer';
import {Provider} from '@ethersproject/abstract-provider';
import {BigNumber} from '@ethersproject/bignumber';

import ABI from '../abis/RootRouter.json';

import Base from './Base';


type CustomerNumberMode = number;

type Router = {
    0: string;
    1: string;
    2: string;
    chainId: string; // 0
    adr: string; // 1
    poolCodeLength: string; // 2
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
    isBlocked: boolean; // 0
    hasSipDomain: boolean; // 1
    hasRouter: boolean; // 2
    owner: string; // 3
    subscriptionEndTime: BigNumber; // 4
    mode: CustomerNumberMode; // 5
    sipDomain: string; // 6
    router: Router; // 7
};

type NumberStatus = {
    0: boolean;
    1: boolean;
    2: boolean;
    3: boolean;
    4: BigNumber;
    5: BigNumber;
    isBlocked: boolean; // 0
    isAvailable: boolean; // 1
    isHolded: boolean; // 2
    isAvailableForBuy: boolean; // 3
    subscriptionEndTime: BigNumber; // 4
    holdingEndTime: BigNumber; // 5
};


export default class RootRouter extends Base {
    constructor(addressOrName: string, signerOrProvider: Signer | Provider) {
        super(addressOrName, ABI, signerOrProvider);
    }


    // ----- [ SETTINGS ] ----------------------------------------------------------------------------------------------

    public POOL_SIZE(): Promise<BigNumber> {
        return this.contract['POOL_SIZE']();
    }

    public buyPrice(): Promise<BigNumber> {
        return this.contract['buyPrice']();
    }

    public subscriptionPrice(): Promise<BigNumber> {
        return this.contract['subscriptionPrice']();
    }

    public modeChangePrice(): Promise<BigNumber> {
        return this.contract['modeChangePrice']();
    }

    public subscriptionDuration(): Promise<BigNumber> {
        return this.contract['subscriptionDuration']();
    }

    public numberFreezeDuration(): Promise<BigNumber> {
        return this.contract['numberFreezeDuration']();
    }

    public ttl(): Promise<string> {
        return this.contract['ttl']();
    }

    public defaultSipDomain(): Promise<string> {
        return this.contract['defaultSipDomain']();
    }


    // ----- [ DATA ] --------------------------------------------------------------------------------------------------

    public pool(code: BigNumber): Promise<CustomerNumber> {
        return this.contract['pool'](code);
    }


    // ----- [ PUBLIC UTILS ] ------------------------------------------------------------------------------------------

    public getTimestamp(): Promise<BigNumber> {
        return this.contract['getTimestamp']();
    }

    public isValidNumber(code: BigNumber): Promise<boolean> {
        return this.contract['isValidNumber'](code);
    }

    public isNumberOwner(code: BigNumber, adr: string): Promise<boolean> {
        return this.contract['isNumberOwner'](code, adr);
    }

    public isBlocked(code: BigNumber): Promise<boolean> {
        return this.contract['isBlocked'](code);
    }

    public isHolded(code: BigNumber): Promise<boolean> {
        return this.contract['isHolded'](code);
    }

    public isAvailableForBuy(code: BigNumber): Promise<boolean> {
        return this.contract['isAvailableForBuy'](code);
    }

    public isNumberMode(code: BigNumber): Promise<boolean> {
        return this.contract['isNumberMode'](code);
    }

    public isPoolMode(code: BigNumber): Promise<boolean> {
        return this.contract['isPoolMode'](code);
    }

    public getMode(code: BigNumber): Promise<CustomerNumberMode> {
        return this.contract['getMode'](code);
    }

    public getNumberStatus(code: BigNumber): Promise<NumberStatus> {
        return this.contract['getNumberStatus'](code);
    }

    public getAvailableNumbers(): Promise<boolean[]> {
        return this.contract['getBlockedNumbers']();
    }

    public getHoldedNumbers(): Promise<boolean[]> {
        return this.contract['getHoldedNumbers']();
    }

    public getAvailableForBuyNumbers(): Promise<boolean[]> {
        return this.contract['getAvailableForBuyNumbers']();
    }

    public getNumberPools(): Promise<boolean[]> {
        return this.contract['getNumberPools']();
    }

    public getAddressNumbers(adr: string): Promise<boolean[]> {
        return this.contract['getAddressNumbers'](adr);
    }


    // ----- [ SMART CONTRACT MANAGEMENT ] -----------------------------------------------------------------------------

    public withdraw(): Promise<void> {
        return this.contract['withdraw']();
    }

    public setBuyPrice(newBuyPrice: BigNumber): Promise<void> {
        return this.contract['setBuyPrice'](newBuyPrice);
    }

    public setSubscriptionPrice(newSubscriptionPrice: BigNumber): Promise<void> {
        return this.contract['setSubscriptionPrice'](newSubscriptionPrice);
    }

    public setModeChangePrice(newModeChangePrice: BigNumber): Promise<void> {
        return this.contract['setModeChangePrice'](newModeChangePrice);
    }

    public setSubscriptionDuration(newSubscriptionDuration: BigNumber): Promise<void> {
        return this.contract['setSubscriptionDuration'](newSubscriptionDuration);
    }

    public setNumberFreezeDuration(newNumberFreezeDuration: BigNumber): Promise<void> {
        return this.contract['setNumberFreezeDuration'](newNumberFreezeDuration);
    }

    public setTtl(newTtl: BigNumber): Promise<void> {
        return this.contract['setTtl'](newTtl);
    }

    public setDefaultSipDomain(newDefaultSipDomain: string): Promise<void> {
        return this.contract['setDefaultSipDomain'](newDefaultSipDomain);
    }

    public takeAwayOwnership(code: BigNumber): Promise<void> {
        return this.contract['takeAwayOwnership'](code);
    }

    public setBlockedStatus(code: BigNumber, newBlockedStatus: boolean): Promise<void> {
        return this.contract['setBlockedStatus'](code, newBlockedStatus);
    }

    public setExpirationTime(code: BigNumber, newExpirationTime: BigNumber): Promise<void> {
        return this.contract['setExpirationTime'](code, newExpirationTime);
    }


    // ----- [ CUSTOMER NUMBER MANAGEMENT ] ----------------------------------------------------------------------------

    public buy(code: BigNumber): Promise<void> {
        return this.contract['buy'](code);
    }

    public renewSubscription(code: BigNumber): Promise<string[]> {
        return this.contract['renewSubscription'](code);
    }

    public transferOwnershipOfCustomerNumber(code: BigNumber, newOwner: string): Promise<string[]> {
        return this.contract['transferOwnershipOfCustomerNumber'](code, newOwner);
    }

    public renounceOwnershipOfCustomerNumber(code: BigNumber): Promise<string[]> {
        return this.contract['renounceOwnershipOfCustomerNumber'](code);
    }

    public changeCustomerNumberMode(code: BigNumber): Promise<string[]> {
        return this.contract['changeCustomerNumberMode'](code);
    }

    public setCustomerNumberSipDomain(code: BigNumber, newSipDomain: string): Promise<string[]> {
        return this.contract['setCustomerNumberSipDomain'](code, newSipDomain);
    }

    public clearCustomerNumberSipDomain(code: BigNumber): Promise<string[]> {
        return this.contract['clearCustomerNumberSipDomain'](code);
    }

    public setCustomerNumberRouter(
        code: BigNumber,
        newChainId: BigNumber,
        newAddress: string,
        newPoolCodeLength: BigNumber
    ): Promise<string[]> {
        return this.contract['setCustomerNumberRouter'](code, newChainId, newAddress, newPoolCodeLength);
    }

    public clearCustomerNumberRouter(code: BigNumber): Promise<string[]> {
        return this.contract['clearCustomerNumberRouter'](code);
    }


    // ----- [ ROUTING ] -----------------------------------------------------------------------------------------------

    public getNextNode(code: BigNumber): Promise<string[]> {
        return this.contract['getNextNode'](code);
    }
}
