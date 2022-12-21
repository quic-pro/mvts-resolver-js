import {JsonRpcProvider} from '@ethersproject/providers';

import {Curator} from '../contracts';
import {DEFAULT_RPC_URLS, DEFAULT_CURATOR_CHAIN_ID, DEFAULT_CURATOR_ADDRESS} from '../constants';


export default function getDefaultCurator(): Curator {
    const provider = new JsonRpcProvider(DEFAULT_RPC_URLS[DEFAULT_CURATOR_CHAIN_ID]);
    return new Curator(DEFAULT_CURATOR_ADDRESS, provider);
}
