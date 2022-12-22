import {Signer} from '@ethersproject/abstract-signer';
import {Provider} from '@ethersproject/abstract-provider';

import ABI from '../abis/RootRouter.json';

import Base from './Base';
import {address, uint256, bytes, PayableOptions} from './types';


enum CodeMode {
    Number,
    Pool
}

type Router = {
    0: string; // chainId
    1: address; // adr
    2: string; // poolCodeLength
    chainId: string; // 0
    adr: address; // 1
    poolCodeLength: string; // 2
};

type Code = {
    0: boolean; // isBlocked
    1: boolean; // hasSipDomain
    2: boolean; // hasRouter
    3: uint256; // subscriptionEndTime
    4: CodeMode; // CodeMode
    5: string; // sipDomain
    6: Router; // router
    isBlocked: boolean; // 0
    hasSipDomain: boolean; // 1
    hasRouter: boolean; // 2
    subscriptionEndTime: uint256; // 3
    mode: CodeMode; // 4
    sipDomain: string; // 5
    router: Router; // 6
};

type CodeStatus = {
    0: boolean; // isBlocked
    1: boolean; // hasOwner
    2: boolean; // isHeld
    3: boolean; // isAvailableForMint
    4: uint256; // subscriptionEndTime
    5: uint256; // holdEndTime
    isBlocked: boolean; // 0
    isAvailable: boolean; // 1
    isHeld: boolean; // 2
    isAvailableForBuy: boolean; // 3
    subscriptionEndTime: uint256; // 4
    holdEndTime: uint256; // 5
};


export default class RootRouter extends Base {
    constructor(addressOrName: address | string, signerOrProvider: Signer | Provider) {
        super(addressOrName, ABI, signerOrProvider);
    }


    // ----- [ SETTINGS ] ----------------------------------------------------------------------------------------------

    public mintPrice(): Promise<uint256> {
        return this.contract['mintPrice']();
    }

    public subscriptionPrice(): Promise<uint256> {
        return this.contract['subscriptionPrice']();
    }

    public modeChangePrice(): Promise<uint256> {
        return this.contract['modeChangePrice']();
    }

    public subscriptionDuration(): Promise<uint256> {
        return this.contract['subscriptionDuration']();
    }

    public holdingDuration(): Promise<uint256> {
        return this.contract['holdingDuration']();
    }

    public ttl(): Promise<uint256> {
        return this.contract['ttl']();
    }

    public baseUri(): Promise<string> {
        return this.contract['baseUri']();
    }

    public defaultSipDomain(): Promise<string> {
        return this.contract['defaultSipDomain']();
    }


    // ----- [ DATA ] --------------------------------------------------------------------------------------------------

    public owner(): Promise<string> {
        return this.contract['owner']();
    }

    public name(): Promise<string> {
        return this.contract['name']();
    }

    public symbol(): Promise<string> {
        return this.contract['symbol']();
    }

    public POOL_SIZE(): Promise<uint256> {
        return this.contract['POOL_SIZE']();
    }


    // ----- [ PUBLIC UTILS ] ------------------------------------------------------------------------------------------

    public supportsInterface(interfaceId: bytes): Promise<boolean> {
        return this.contract['supportsInterface'](interfaceId);
    }

    public tokenURI(tokenId: uint256): Promise<string> {
        return this.contract['tokenURI'](tokenId);
    }

    public balanceOf(owner: address): Promise<number> {
        return this.contract['balanceOf'](owner);
    }

    public ownerOf(tokenId: uint256): Promise<string> {
        return this.contract['ownerOf'](tokenId);
    }

    public hasOwner(code: uint256): Promise<boolean> {
        return this.contract['hasOwner'](code);
    }

    public getCodeData(code: uint256): Promise<Code> {
        return this.contract['getCodeData'](code);
    }

    public isBlocked(code: uint256): Promise<boolean> {
        return this.contract['isBlocked'](code);
    }

    public isHeld(code: uint256): Promise<boolean> {
        return this.contract['isHeld'](code);
    }

    public isAvailableForBuy(code: uint256): Promise<boolean> {
        return this.contract['isAvailableForBuy'](code);
    }

    public isNumberMode(code: uint256): Promise<boolean> {
        return this.contract['isNumberMode'](code);
    }

    public isPoolMode(code: uint256): Promise<boolean> {
        return this.contract['isPoolMode'](code);
    }

    public getMode(code: uint256): Promise<CodeMode> {
        return this.contract['getMode'](code);
    }

    public getCodeStatus(code: uint256): Promise<CodeStatus> {
        return this.contract['getCodeStatus'](code);
    }

    public getBlockedCodes(): Promise<boolean[]> {
        return this.contract['getBlockedCodes']();
    }

    public getHeldCodes(): Promise<boolean[]> {
        return this.contract['getHeldCodes']();
    }

    public getAvailableForMintCodes(): Promise<boolean[]> {
        return this.contract['getAvailableForMintCodes']();
    }

    public getPoolCodes(): Promise<boolean[]> {
        return this.contract['getPoolCodes']();
    }

    public getOwnerCodes(adr: address): Promise<boolean[]> {
        return this.contract['getOwnerCodes'](adr);
    }


    // ----- [ SMART CONTRACT MANAGEMENT ] -----------------------------------------------------------------------------

    public withdraw(): Promise<void> {
        return this.contract['withdraw']();
    }

    public setMintPrice(newMintPrice: uint256): Promise<void> {
        return this.contract['setMintPrice'](newMintPrice);
    }

    public setSubscriptionPrice(newSubscriptionPrice: uint256): Promise<void> {
        return this.contract['setSubscriptionPrice'](newSubscriptionPrice);
    }

    public setModeChangePrice(newModeChangePrice: uint256): Promise<void> {
        return this.contract['setModeChangePrice'](newModeChangePrice);
    }

    public setSubscriptionDuration(newSubscriptionDuration: uint256): Promise<void> {
        return this.contract['setSubscriptionDuration'](newSubscriptionDuration);
    }

    public setHoldingDuration(newHoldingDuration: uint256): Promise<void> {
        return this.contract['setHoldingDuration'](newHoldingDuration);
    }

    public setTtl(newTtl: uint256): Promise<void> {
        return this.contract['setTtl'](newTtl);
    }

    public setDefaultSipDomain(newDefaultSipDomain: string): Promise<void> {
        return this.contract['setDefaultSipDomain'](newDefaultSipDomain);
    }

    public setBaseUri(newBaseUri: string): Promise<void> {
        return this.contract['setBaseUri'](newBaseUri);
    }

    public setCodeBlockedStatus(code: uint256, newBlockedStatus: boolean): Promise<void> {
        return this.contract['setCodeBlockedStatus'](code, newBlockedStatus);
    }

    public setCodeSubscriptionEndTime(code: uint256, newSubscriptionEndTime: uint256): Promise<void> {
        return this.contract['setCodeSubscriptionEndTime'](code, newSubscriptionEndTime);
    }


    // ----- [ CODE MANAGEMENT ] ---------------------------------------------------------------------------------------

    public safeTransferFrom(from: address, to: address, tokenId: uint256, data?: bytes): Promise<void> {
        return this.contract['safeTransferFrom(address,address,uint256,bytes)'](from, to, tokenId, data);
    }

    public transferFrom(from: address, to: address, tokenId: uint256): Promise<void> {
        return this.contract['transferFrom'](from, to, tokenId);
    }

    public approve(to: address, tokenId: uint256): Promise<void> {
        return this.contract['approve'](to, tokenId);
    }

    public setApprovalForAll(operator: address, approved: boolean): Promise<void> {
        return this.contract['setApprovalForAll'](operator, approved);
    }

    public getApproved(tokenId: uint256): Promise<string> {
        return this.contract['getApproved'](tokenId);
    }

    public isApprovedForAll(owner: address, operator: address): Promise<boolean> {
        return this.contract['isApprovedForAll'](owner, operator);
    }

    public mint(code: uint256, options: PayableOptions): Promise<void> {
        return this.contract['mint'](code, options);
    }

    public renewSubscription(code: uint256, options: PayableOptions): Promise<void> {
        return this.contract['renewSubscription'](code, options);
    }

    public transferOwnershipOfCode(code: uint256, newOwner: address): Promise<void> {
        return this.contract['transferOwnershipOfCode'](code, newOwner);
    }

    public renounceOwnershipOfCode(code: uint256): Promise<void> {
        return this.contract['renounceOwnershipOfCode'](code);
    }

    public changeCodeMode(code: uint256): Promise<void> {
        return this.contract['changeCodeMode'](code);
    }

    public setCodeSipDomain(code: uint256, newSipDomain: string): Promise<void> {
        return this.contract['setCodeSipDomain'](code, newSipDomain);
    }

    public clearCodeSipDomain(code: uint256): Promise<void> {
        return this.contract['clearCodeSipDomain'](code);
    }

    public setCodeRouter(
        code: uint256,
        newChainId: uint256,
        newAdr: address,
        newPoolCodeLength: uint256
    ): Promise<void> {
        return this.contract['setCodeRouter'](code, newChainId, newAdr, newPoolCodeLength);
    }

    public clearCodeRouter(code: uint256): Promise<void> {
        return this.contract['clearCodeRouter'](code);
    }


    // ----- [ ROUTING ] -----------------------------------------------------------------------------------------------

    public getNextNode(code: uint256): Promise<string[]> {
        return this.contract['getNextNode'](code);
    }
}
