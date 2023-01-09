import { Provider } from '@ethersproject/providers';
import { Signer } from '@ethersproject/abstract-signer';
import { RootRouter } from '@mvts/contract-interfaces-js';
export declare function getActualRootRouter(getSignerOrProvider?: (chainId: number) => Signer | Provider): Promise<RootRouter>;
