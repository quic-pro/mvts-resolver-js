import Curator from './contracts/Curator';
import RootRouter from './contracts/RootRouter';
import Router from './contracts/Router';

export default class Resolver {
    constructor() {
        this.curator = new Curator();
        this.expirationTimeRootRouter = 0;
    }


    // --- [ PRIVATE PROPERTIES ] ------------------------------------------------------------------------------------

    private readonly curator: Curator;
    private expirationTimeRootRouter: number;
    private rootRouter: RootRouter | null;


    // --- [ PRIVATE METHODS ] ----------------------------------------------------------------------------------------

    private getRootRouter(): Promise<RootRouter> {
        if (!this.rootRouter || (Date.now() > this.expirationTimeRootRouter)) {
            return new Promise((resolve, reject) => {
                this.curator.rootRouter()
                    .then((rootRouter) => {
                        this.expirationTimeRootRouter = Date.now() + rootRouter.ttl.toNumber() * 1000;

                        if (this.rootRouter) {
                            this.rootRouter.updateContract(rootRouter.chainId.toNumber(), rootRouter.adr);
                        } else {
                            this.rootRouter = new RootRouter(rootRouter.chainId.toNumber(), rootRouter.adr);
                        }

                        resolve(this.rootRouter);

                    })
                    .catch(reject);
            });
        }

        return Promise.resolve(this.rootRouter);
    }

    private getNextNode(router: RootRouter | Router, code: number): Promise<string[]> {
        return new Promise((resolve, reject) => {
            router.getNextNode(code)
                .then(resolve)
                .catch(reject);
        });
    }


    // --- [ PUBLIC METHODS ] -----------------------------------------------------------------------------------------

    public async getEndNode(phoneNumber: string): Promise<any> {
        const numbers = phoneNumber.split('');

        return new Promise(async (resolve, reject) => {
            try {
                let node: RootRouter | Router  = await this.getRootRouter();

                if (this.rootRouter) {
                    const numberForRoot = numbers.splice(0, 3);
                    const code = +numberForRoot.join('')

                    let result: string[] = [];
                    do {
                        result = await this.getNextNode(node, code);
                        console.log(result);
                        if (result[2] !== '0') {
                            node = new Router(+result[2], result[3]);
                        }
                    } while (result[2] !== '0');

                    resolve(result);
                } else {
                    reject(new Error('rootRouter is null.'));
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}
