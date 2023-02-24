import { Provider } from '@ethersproject/providers';
import { Signer } from '@ethersproject/abstract-signer';
import { Curator } from '@mvts/contract-interfaces-js';
export declare function getActualCurator(signerOrProvider?: Signer | Provider, testnet?: boolean): Curator;
