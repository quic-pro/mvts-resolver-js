import {JsonRpcProvider} from '@ethersproject/providers';

import {RootRouter} from '../contracts';
import {DEFAULT_RPC_URLS} from '../constants';

import getDefaultCurator from './getDefaultCurator';


export default function getDefaultRootRouter(): Promise<RootRouter> {
    return new Promise((resolve, reject) => {
        const curator = getDefaultCurator();

        curator.getRootRouter()
            .then((rootRouterData) => {
                const responseCode = rootRouterData[0];
                if (responseCode != '200') {
                    reject(rootRouterData);
                }
                const chainId = Number(rootRouterData[2])
                const adr = rootRouterData[3]

                const provider = new JsonRpcProvider(DEFAULT_RPC_URLS[chainId]);
                const rootRouter = new RootRouter(adr, provider);

                resolve(rootRouter);
            })
            .catch(reject);
    });
}
