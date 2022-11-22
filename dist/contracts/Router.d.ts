import { Signer } from '@ethersproject/abstract-signer';
import { Provider } from '@ethersproject/abstract-provider';
import { BigNumber } from '@ethersproject/bignumber';
import Base from './Base';
export default class Router extends Base {
    constructor(addressOrName: string, signerOrProvider: Signer | Provider);
    getNextNode(code: BigNumber): Promise<string[]>;
}
