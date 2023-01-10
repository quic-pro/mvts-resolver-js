import {Router} from '@mvts/contract-interfaces-js';


export function nodeIsNumber(nodeData: Router.NodeDataStructOutput): boolean {
    // The number has a sipUri (not equal to the empty string).
    return (nodeData.sipUri.length !== 0);
}

export function nodeIsPool(nodeData: Router.NodeDataStructOutput): boolean {
    // The pool has no sipUri (equal to an empty string).
    return (nodeData.sipUri.length === 0);
}
