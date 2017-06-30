declare const util: {
    path: {
        getFullPath(url?: string, pre?: string): string;
    };
    type: {
        isObject(value: any): boolean;
        isArray(value: any): boolean;
        isPromise(value: any): boolean;
        isIterator(value: any): any;
        isString(value: any): boolean;
        isNumber(value: any): boolean;
        isBoolean(value: any): boolean;
        isSymbol(value: any): boolean;
        isUndefined(value: any): boolean;
        isNull(value: any): boolean;
        isNaN(value: any): boolean;
    };
    array: {};
    math: {};
    date: {
        getLocalDateString(date?: Date, ifBeauty?: boolean): string;
    };
    interface: {
        getAllIps(): string[];
        getBeautyStrOfIp(port: number, proxy?: string): string;
    };
};
export { util };
