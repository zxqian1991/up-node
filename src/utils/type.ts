export function isObject(value : any) {
    return typeof value == "object";
};
export function isArray(value : any) {
    return typeof value == "object" && value instanceof Array;
}
export function isPromise(value : any) {
    return value instanceof Promise;
}
export function isIterator(value : any) {
    return value.hasOwnProperty(Symbol.iterator);
}
export function isString(value : any) {
    return typeof value == "string";
}
export function isNumber(value : any) {
    return typeof value == "number";
}
export function isBoolean(value : any) {
    return typeof value == "boolean";
}
export function isSymbol(value : any) {
    return typeof value == "symbol";
}
export function isUndefined(value : any) {
    return value === undefined;
}
export function isNull(value : any) {
    return value === null;
}