import {Provider, JsonRpcProvider} from '@ethersproject/providers';
import {Signer} from '@ethersproject/abstract-signer';
import {ResponseCode, RootRouter, RootRouterFactory} from '@mvts/contract-interfaces-js';

import {DEFAULT_TEST_RPC_URLS, DEFAULT_RPC_URLS} from '../constants';
import {getActualCurator} from './getActualCurator';


export function getActualRootRouter(getSignerOrProvider?: (chainId: number) => Signer | Provider, testnet = false): Promise<RootRouter> {
    const curator = getActualCurator(undefined, testnet);

    return curator.getRootRouter()
        .then(({responseCode, router}) => {
            if (!responseCode.eq(ResponseCode.OK)) {
                throw new Error(`Response code ${responseCode.toString()}.`);
            }

            if (!getSignerOrProvider) {
                getSignerOrProvider = (chainId: number) => new JsonRpcProvider(testnet ? DEFAULT_TEST_RPC_URLS[chainId] : DEFAULT_RPC_URLS[chainId]);
            }

            return RootRouterFactory.connect(router.adr, getSignerOrProvider(router.chainId.toNumber()));
        });
}
