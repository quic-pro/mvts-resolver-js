import {Curator, Router} from './contracts';

import {ResolverConfig} from './types';

import {POOL_CODE_LENGTH} from './constants/rootRouter';


type RouterCache = {
    expirationTime: number;
    nodeData: string[];
    cache: Map<number, RouterCache>;
};


export default class Resolver {
    constructor(config?: ResolverConfig) {
        this.curator = new Curator(config?.curatorConfig, config?.rpcUrls);
        this.router = new Router(config?.rpcUrls);
        this.rootRouterCache = new Map<number, RouterCache>();

        this.expirationTimeRootRouter = 0;
    }


    // --- [ PRIVATE PROPERTIES ] ------------------------------------------------------------------------------------

    private readonly curator: Curator;
    private readonly router: Router;
    private readonly rootRouterCache: Map<number, RouterCache>;

    private expirationTimeRootRouter: number;
    private rootRouterData: string[];


    // --- [ PRIVATE METHODS ] ----------------------------------------------------------------------------------------

    private getRootRouterData(): Promise<string[]> {
        if (Date.now() < this.expirationTimeRootRouter) {
            return Promise.resolve(this.rootRouterData);
        }

        return new Promise((resolve, reject) => {
            this.curator.getRootRouter()
                .then((rootRouterData) => {
                    // TODO: Check if RootRouter is null
                    this.expirationTimeRootRouter = Date.now() + +rootRouterData[4] * 1000;
                    this.rootRouterData = rootRouterData;
                    // TODO: Rest cache if root router is changed
                    //this.rootRouterCache = new Map<number, RouterCache>();
                    if (rootRouterData[0] === '200') {
                        resolve(rootRouterData);
                    } else {
                        reject(rootRouterData[0]);
                    }
                })
                .catch(reject);
        });
    }


    // --- [ PUBLIC METHODS ] -----------------------------------------------------------------------------------------

    public getAddress(phoneNumber: string): Promise<string[]> {
        return new Promise(async (resolve, reject) => {
            const numbers = phoneNumber.split('');

            try {
                let routerCache = this.rootRouterCache;
                let poolCodeLength = POOL_CODE_LENGTH;
                let nextNodeData = await this.getRootRouterData();

                while (numbers.length) {
                    if (numbers.length < poolCodeLength) {
                        throw new Error('Invalid phone number.');
                    }

                    const code = +numbers.splice(0, poolCodeLength).join('');
                    const cachedNodeData = routerCache.get(code);

                    if (cachedNodeData && (Date.now() < cachedNodeData.expirationTime)) {
                        nextNodeData = cachedNodeData.nodeData;
                    } else {
                        this.router.updateContract(+nextNodeData[2], nextNodeData[3]);
                        nextNodeData = await this.router.getNextNode(code);
                        routerCache.set(code, {
                            expirationTime: Date.now() + (+nextNodeData[4] * 1000),
                            nodeData: nextNodeData,
                            cache: new Map<number, RouterCache>()
                        });
                    }

                    if (nextNodeData[0] !== '200') {
                        reject(nextNodeData[0]);
                    } else if (nextNodeData[1] === '0') {
                        if (numbers.length === 0) {
                            resolve(nextNodeData);
                        } else {
                            throw new Error('Invalid phone number.');
                        }
                    }

                    poolCodeLength = +nextNodeData[1];
                    // @ts-ignore
                    routerCache = routerCache.get(code).cache;
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}
