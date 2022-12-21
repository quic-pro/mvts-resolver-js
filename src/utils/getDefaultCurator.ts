import {JsonRpcProvider} from '@ethersproject/providers';

import {Curator} from '../contracts';
import {DEFAULT_RPC_URLS, ACTUAL_CURATOR_CHAIN_ID, ACTUAL_CURATOR_ADDRESS} from '../constants';


export default function getDefaultCurator(): Curator {
    const provider = new JsonRpcProvider(DEFAULT_RPC_URLS[ACTUAL_CURATOR_CHAIN_ID]);
    return new Curator(ACTUAL_CURATOR_ADDRESS, provider);
}
