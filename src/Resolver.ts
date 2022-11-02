import { Router } from 'types';
import Curator from './contracts/Curator';


export default class Resolver {
    constructor() {
        this.curator = new Curator();
        this.expirationTimeRootRouter = 0;
    }

    private readonly curator: Curator;
    private expirationTimeRootRouter: number;
    private rootRouter: Router | null;


    private updateRootRouter(): Promise<void> {
        if (!this.rootRouter || (this.expirationTimeRootRouter + this.rootRouter.ttl.toNumber() * 1000 > Date.now())) {
            return this.curator.rootRouter()
                .then((rootRouter) => {
                    this.rootRouter = rootRouter;
                    this.expirationTimeRootRouter = Date.now();
                })
                .catch(console.log);
        } else {
            return Promise.resolve();
        }
    }

    public async getEndNode(phoneNumber: number): Promise<any> {
        const numbers = phoneNumber.toString().split('');

        return new Promise(async (resolve, reject) => {
            await this.updateRootRouter();

            const numberForRoot = numbers.splice(0, 3);
            const code = +numberForRoot.join('')
            this.rootRouter.getNextNode(code);
        });
    }
}
