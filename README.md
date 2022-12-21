# mvts-resolver-js

***

## Resolver

```javascript
// CommonJS
const Resolver = require('mvts-resolver');
// ES6
import Resolver from 'mvts-resolver';


const resolver = new Resolver();
resolver.getPhoneNumberData('30010645')
    .then((phoneNumberData) => console.log('Data for making a call:', phoneNumberData))
    .catch(console.log);
```

| Method             | Parameters                             | Return value        | Description                                      |
|--------------------|----------------------------------------|---------------------|--------------------------------------------------|
| constructor        | curator?: Curator<br>options?: Options |                     |                                                  |
| getPhoneNumberData | phoneNumber: string                    | Promise\<string[]\> | Returns the phone number data for making a call. |

## constants

```javascript
// CommonJS
const {constants} = require('mvts-resolver');
// ES6
import {constants} from 'mvts-resolver';
```

| Name                    | Type   | Description                                                                                                                   |
|-------------------------|--------|-------------------------------------------------------------------------------------------------------------------------------|
| ACTUAL_CURATOR_CHAIN_ID | number | The chain ID of the current smart contract Curator.                                                                           |
| ACTUAL_CURATOR_ADDRESS  | string | The address of the current smart contract Curator.                                                                            |
| DEFAULT_RPC_URLS        | object | Default RPC URLs. It is guaranteed that this is enough to work with chains in which the curator and root router are deployed. |

## utils

```javascript
// CommonJS
const {utils} = require('mvts-resolver');
// ES6
import {utils} from 'mvts-resolver';
```

| Name                 | Parameters | Return value          | Description                                                        |
|----------------------|------------|-----------------------|--------------------------------------------------------------------|
| getDefaultCurator    |            | Curator               | Returns the actual curator.                                        |
| getDefaultRootRouter |            | Promise\<RootRouter\> | Returns the actual root router requested from the default curator. |

## contracts

```javascript
// CommonJS
const {contracts} = require('mvts-resolver');
// ES6
import {contracts} from 'mvts-resolver';
```

| Name       | Description                                                                                                  |
|------------|--------------------------------------------------------------------------------------------------------------|
| Base       |                                                                                                              |
| Curator    | Class for interaction with smart contract Curator.                                                           |
| RootRouter | Class for interaction with smart contract RootRouter.                                                        |
| Router     | Class for interaction with smart contract any router. Used in routing: contains only the getNextNode method. |
