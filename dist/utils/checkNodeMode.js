"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeIsPool = exports.nodeIsNumber = void 0;
function nodeIsNumber(nodeData) {
    // The number has a sipUri (not equal to the empty string).
    return (nodeData.sipUri.length !== 0);
}
exports.nodeIsNumber = nodeIsNumber;
function nodeIsPool(nodeData) {
    // The pool has no sipUri (equal to an empty string).
    return (nodeData.sipUri.length === 0);
}
exports.nodeIsPool = nodeIsPool;
