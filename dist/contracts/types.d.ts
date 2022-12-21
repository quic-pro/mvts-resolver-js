import { BigNumber } from '@ethersproject/bignumber';
export type uint256 = number | BigNumber;
export type address = string;
export type bytes = string;
export type PayableOptions = {
    value: uint256;
    gasLimit: number;
};
