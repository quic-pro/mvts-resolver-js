import {Provider, JsonRpcProvider} from '@ethersproject/providers';
import {Signer} from '@ethersproject/abstract-signer';
import {Curator, CuratorFactory} from '@mvts/contract-interfaces-js';

import {DEFAULT_RPC_URLS, ACTUAL_CURATOR_CHAIN_ID, ACTUAL_CURATOR_ADDRESS} from '../constants';


export function getActualCurator(signerOrProvider?: Signer | Provider): Curator {
    if (!signerOrProvider) {
        signerOrProvider = new JsonRpcProvider(DEFAULT_RPC_URLS[ACTUAL_CURATOR_CHAIN_ID]);
    }

    return CuratorFactory.connect(ACTUAL_CURATOR_ADDRESS, signerOrProvider);
}
