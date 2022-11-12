import {Curator, RootRouter, Router} from './contracts';

import {ResolverConfig} from './types';


export default class Resolver {
    constructor(config?: ResolverConfig) {
        this.curator = new Curator(config?.curatorConfig);
        this.rootRouter = new RootRouter(config?.rootRouterAbi);
        this.router = new Router(config?.routerAbi);
        this.expirationTimeRootRouter = 0;
    }


    // --- [ PRIVATE PROPERTIES ] ------------------------------------------------------------------------------------

    private readonly curator: Curator;
    private readonly rootRouter: RootRouter;
    private readonly router: Router;
    private expirationTimeRootRouter: number;


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

    public async getAddress(phoneNumber: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const numbers = phoneNumber.split('');

            try {
                await this.updateRootRouter();

                let count = 0, poolCodeLength = 3;
                while (true) {
                    const code = +numbers.splice(0, poolCodeLength).join('');
                    const node: RootRouter | Router = count == 0 ? this.rootRouter : this.router;
                    const nextNode = await this.getNextNode(node, code);

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

                    ++count;
                    if (count > 10) {
                        reject(new Error('Routing depth exceeded.'));
                    }
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}
