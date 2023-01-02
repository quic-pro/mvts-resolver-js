# @mvts/resolver-js

***

## Resolver

```javascript
// CommonJS
const Resolver = require('@mvts/resolver-js');
// ES6
import Resolver from '@mvts/resolver-js';


const resolver = new Resolver();
resolver.getSipUri('30010645')
    .then((sipUri) => console.log('SIP URI:', sipUri))
    .catch(console.log);
```

| Method      | Parameters                             | Return value      | Description                                      |
|-------------|----------------------------------------|-------------------|--------------------------------------------------|
| constructor | curator?: Curator<br>options?: Options |                   |                                                  |
| getSipUri   | phoneNumber: string                    | Promise\<string\> | Returns the phone number data for making a call. |

## constants

```javascript
// CommonJS
const {constants} = require('@mvts/resolver-js');
// ES6
import {constants} from '@mvts/resolver-js';
```

| Name                    | Type   | Description                                                                                                                   |
|-------------------------|--------|-------------------------------------------------------------------------------------------------------------------------------|
| ACTUAL_CURATOR_CHAIN_ID | number | The chain ID of the current smart contract Curator.                                                                           |
| ACTUAL_CURATOR_ADDRESS  | string | The address of the current smart contract Curator.                                                                            |
| DEFAULT_RPC_URLS        | object | Default RPC URLs. It is guaranteed that this is enough to work with chains in which the curator and root router are deployed. |

## utils

```javascript
// CommonJS
const {utils} = require('@mvts/resolver-js');
// ES6
import {utils} from '@mvts/resolver-js';
```

| Name             | Parameters | Return value | Description                |
|------------------|------------|--------------|----------------------------|
| getActualCurator |            | Curator      | Returns the actual curator. |
