import {RPC} from '../constants/prc';


export default function getRpc(chainId: number): string {
    return RPC[chainId];
}
