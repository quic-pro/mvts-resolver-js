import {Curator, RootRouter, Router} from './contracts';

import {ResolverConfig} from './types';

type CodeCache = {
    node: string[];
    expirationTime: number;
    cache: CodeCache[];
};


export default class Resolver {
    constructor(config?: ResolverConfig) {
        this.curator = new Curator(config?.curatorConfig);
        this.rootRouter = new RootRouter(config?.rootRouterAbi);
        this.router = new Router(config?.routerAbi);
        this.expirationTimeRootRouter = 0;
        this.cache = [];
    }


    // --- [ PRIVATE PROPERTIES ] ------------------------------------------------------------------------------------

    private readonly curator: Curator;
    private readonly rootRouter: RootRouter;
    private readonly router: Router;
    private expirationTimeRootRouter: number;
    private cache: CodeCache[];


    // --- [ PRIVATE METHODS ] ----------------------------------------------------------------------------------------

    private updateRootRouter(): Promise<void> {
        if (Date.now() < this.expirationTimeRootRouter) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            this.curator.rootRouter()
                .then((rootRouter) => {
                    // TODO: Check if RootRouter is null
                    this.expirationTimeRootRouter = Date.now() + rootRouter.ttl.toNumber() * 1000;
                    this.rootRouter.updateContract(rootRouter.chainId.toNumber(), rootRouter.adr);
                    resolve();
                })
                .catch(reject);
        });
    }

    private getNextNode(router: RootRouter | Router, code: number): Promise<string[]> {
        return router.getNextNode(code);
    }


    // --- [ PUBLIC METHODS ] -----------------------------------------------------------------------------------------

    public async getAddress(phoneNumber: string): Promise<string[]> {
        return new Promise(async (resolve, reject) => {
            const numbers = phoneNumber.split('');

            try {
                await this.updateRootRouter();

                let poolCodeLength = 3;
                let cache = this.cache;
                while (true) {
                    const code = +numbers.splice(0, poolCodeLength).join('');

                    let nextNode: string[] = [];
                    if (cache[code] && (Date.now() < cache[code].expirationTime)) {
                        nextNode = cache[code].node;
                    } else {
                        const node: RootRouter | Router = (cache == this.cache ? this.rootRouter : this.router);
                        nextNode = await this.getNextNode(node, code);
                        cache[code] = {
                            node: nextNode,
                            cache: [],
                            expirationTime: Date.now() + (+nextNode[4] * 1000)
                        };
                    }

                    if (nextNode[0] !== '200') {
                        reject(new Error(nextNode[0]));
                        break;
                    } else if (nextNode[1] === '0') {
                        resolve(nextNode);
                        break;
                    } else {
                        this.router.updateContract(+nextNode[2], nextNode[3]);
                        poolCodeLength = +nextNode[1];
                    }

                    cache = cache[code].cache;
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}
