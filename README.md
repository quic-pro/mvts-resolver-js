# @mvts/resolver-js

***

## Resolver

```javascript
// CommonJS
const {Resolver} = require('@mvts/resolver-js');
// ES6
import {Resolver} from '@mvts/resolver-js';


const resolver = new Resolver();
resolver.getSipUri('30010645')
    .then((sipUri) => console.log('SIP URI:', sipUri))
    .catch(console.log);
```

| Method      | Parameters               | Return value      | Description                                      |
|-------------|--------------------------|-------------------|--------------------------------------------------|
| constructor | options: ResolverOptions |                   |                                                  |
| getUseCache |                          | boolean           |                                                  |
| setUseCache | useCache: boolean        | void              |                                                  |
| clearCache  |                          | void              |                                                  |
| getSipUri   | phoneNumber: string      | Promise\<string\> | Returns the phone number data for making a call. |

#### ResolverOptions

```javascript
const resolver = new Resolver({
    curator: new MyCurator(),
    rpcUrlsAndProviders: {
        80001: 'https://matic-mumbai.chainstacklabs.com',
        11155111: new JsonRpcProvider('https://rpc.sepolia.org')
    },
    useDefaultRpcUrls: false,
    useCache: true
});
```

| Name                | Required | Type                                        | Default | Description |
|---------------------|----------|---------------------------------------------|---------|-------------|
| curator             | No       | Curator                                     | -       |             |
| rpcUrlsAndProviders | No       | {[chainId: number]: string &#124; Provider} | -       |             |
| useDefaultRpcUrls   | No       | boolean                                     | true    |             |
| useCache            | No       | boolean                                     | true    |             |


## Constants

```javascript
// CommonJS
const {
    ACTUAL_CURATOR_CHAIN_ID,
    ACTUAL_CURATOR_ADDRESS,
    DEFAULT_RPC_URLS
} = require('@mvts/resolver-js');
// ES6
import {
    ACTUAL_CURATOR_CHAIN_ID,
    ACTUAL_CURATOR_ADDRESS,
    DEFAULT_RPC_URLS
} from '@mvts/resolver-js';
```

| Name                    | Type   | Description                                                                                                                   |
|-------------------------|--------|-------------------------------------------------------------------------------------------------------------------------------|
| ACTUAL_CURATOR_CHAIN_ID | number | The chain ID of the current smart contract Curator.                                                                           |
| ACTUAL_CURATOR_ADDRESS  | string | The address of the current smart contract Curator.                                                                            |
| DEFAULT_RPC_URLS        | object | Default RPC URLs. It is guaranteed that this is enough to work with chains in which the curator and root router are deployed. |

## Utils

```javascript
// CommonJS
const {getActualCurator, getActualRootRouter} = require('@mvts/resolver-js');
// ES6
import {getActualCurator, getActualRootRouter} from '@mvts/resolver-js';
```

| Name                | Parameters                                                        | Return value              | Description                     |
|---------------------|-------------------------------------------------------------------|---------------------------|---------------------------------|
| getActualCurator    | signerOrProvider?: Signer &#124; Provider                         | Curator                   | Returns the actual curator.     |
| getActualRootRouter | getSignerOrProvider?: (chainId: number) => Signer &#124; Provider | Promise&lt;RootRouter&gt; | Returns the actual root router. |
