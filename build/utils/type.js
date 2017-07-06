"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isObject(value) {
    return typeof value == "object";
}
exports.isObject = isObject;
;
function isArray(value) {
    return typeof value == "object" && value instanceof Array;
}
exports.isArray = isArray;
function isPromise(value) {
    return value instanceof Promise;
}
exports.isPromise = isPromise;
function isIterator(value) {
    return value.hasOwnProperty(Symbol.iterator);
}
exports.isIterator = isIterator;
function isString(value) {
    return typeof value == "string";
}
exports.isString = isString;
function isNumber(value) {
    return typeof value == "number";
}
exports.isNumber = isNumber;
function isBoolean(value) {
    return typeof value == "boolean";
}
exports.isBoolean = isBoolean;
function isSymbol(value) {
    return typeof value == "symbol";
}
exports.isSymbol = isSymbol;
function isUndefined(value) {
    return value === undefined;
}
exports.isUndefined = isUndefined;
function isNull(value) {
    return value === null;
}
exports.isNull = isNull;
