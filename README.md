# @mvts/resolver-js

***

## Installation

Using npm:

```bash
npm install @mvts/resolver-js
```

Using yarn:

```bash
yarn add @mvts/resolver-js
```

Once the package is installed, you can import the library using import or require approach:

```javascript
// CommonJS
const {Resolver} = require('@mvts/resolver-js');

// ES6
import {Resolver} from '@mvts/resolver-js';
```

## Usage

```javascript
import {Resolver} from '@mvts/resolver-js';


const resolver = new Resolver({
    rpcUrlsAndProviders: {
        1: 'https://example.com/rpc/ethereum-mainnet', // Ethereum Mainnet
        137: new JsonRpcProvider('https://example.com/rpc/polygon-mainnet') // Polygon Mainnet
    },
    useDefaultRpcUrls: false
});

resolver.getSipUri('30010645')
    .then((sipUri) => console.log('SIP URI:', sipUri))
    .catch((error) => console.log(`Failed to get SIP URI: ${error.message}`));
```

#### Options


| Name                           | Type                                        | Default                                | Description                                                                                                                             |
|--------------------------------|---------------------------------------------|----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| curator (optional)             | Curator                                     | getActualCurator()                     | Custom curator. You can specify your curator, for example, for faster routing through your pool of numbers.                             |
| rpcUrlsAndProviders (optional) | {[chainId: number]: string &vert; Provider} | DEFAULT_RPC_URLS if useDefaultRpcUrls  | DEFAULT_RPC_URLS are public so can be unreliable and slow, so you can specify your own RPC URLs and providers.                          |
| useDefaultRpcUrls (optional)   | boolean                                     | true                                   | This option allows you to disable the use of RPC URLs by default. By default are used.                                                  |
| useCache (optional)            | boolean                                     | true                                   | The resolver caches the data and uses it according to TTL. This option allows you to disable cache usage. The cache is used by default. |

#### Methods

| Name                                            | Description                                                                                  |
|-------------------------------------------------|----------------------------------------------------------------------------------------------|
| getUseCache(): boolean                          | Returns the current value of the useCache flag, which enables/disables the use of the cache. |
| setUseCache(useCache: boolean): void            | Changes the value of the useCache flag, which enables/disables the use of the cache.         |
| clearCache(): void                              | Clears the cache.                                                                            |
| getSipUri(phoneNumber: string): Promise<string> | Returns SIP URI for making a call.                                                           |

## Constants

| Name                    | Type   | Description                                                                                                                   |
|-------------------------|--------|-------------------------------------------------------------------------------------------------------------------------------|
| ACTUAL_CURATOR_CHAIN_ID | number | The chain ID of the current smart contract Curator.                                                                           |
| ACTUAL_CURATOR_ADDRESS  | string | The address of the current smart contract Curator.                                                                            |
| DEFAULT_RPC_URLS        | object | Default RPC URLs. It is guaranteed that this is enough to work with chains in which the curator and root router are deployed. |

## Utils

| Name                                                                                                              | Description                                                                                                                                                                                                                                  |
|-------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| getActualCurator(signerOrProvider?: Signer &vert; Provider): Curator                                              | Returns the actual curator.                                                                                                                                                                                                                  |
| getActualRootRouter(getSignerOrProvider?: (chainId: number) => Signer &vert; Provider): Promise&lt;RootRouter&gt; | Returns the actual root router. The root router can change and be in any chain, so getSignerOrProvider is a function that returns the appropriate provider or signer depending on the current chainId of the root router. See example below. |

#### getActualRootRouter usage example

```javascript
import {getActualRootRouter, DEFAULT_RPC_URLS} from '@mvts/resolver-js';
import {JsonRpcProvider} from '@ethersproject/providers';


function getSignerOrProvider(chainId) {
    const rpcUrl =  DEFAULT_RPC_URLS[chainId];
    if (!rpcUrl) {
        throw new Error(`Missing provider for chain ${chainId}.`);
    }

    return new JsonRpcProvider(rpcUrl);
}


getActualRootRouter(getSignerOrProvider)
    .then((rootRouter) => console.log(`Address of the actual root router: ${rootRouter.address}`))
    .catch((error) => console.log(`Failed to get the actual root router: ${error.message}`));
```
