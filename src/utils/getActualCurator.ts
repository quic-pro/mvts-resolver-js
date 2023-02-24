import {Provider, JsonRpcProvider} from '@ethersproject/providers';
import {Signer} from '@ethersproject/abstract-signer';
import {Curator, CuratorFactory} from '@mvts/contract-interfaces-js';

import {
    ACTUAL_TEST_CURATOR_CHAIN_ID,
    ACTUAL_TEST_CURATOR_ADDRESS,
    ACTUAL_CURATOR_CHAIN_ID,
    ACTUAL_CURATOR_ADDRESS,
    DEFAULT_TEST_RPC_URLS,
    DEFAULT_RPC_URLS,
} from '../constants';


export function getActualCurator(signerOrProvider?: Signer | Provider, testnet = false): Curator {
    if (!signerOrProvider) {
        const rpcUrl = testnet ? DEFAULT_TEST_RPC_URLS[ACTUAL_TEST_CURATOR_CHAIN_ID] : DEFAULT_RPC_URLS[ACTUAL_CURATOR_CHAIN_ID];
        signerOrProvider = new JsonRpcProvider(rpcUrl);
    }

    return CuratorFactory.connect(testnet ? ACTUAL_TEST_CURATOR_ADDRESS : ACTUAL_CURATOR_ADDRESS, signerOrProvider);
}
