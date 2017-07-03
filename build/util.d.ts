/// <reference types="node" />
import * as fs from "fs";
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
        getLocalDateString(date?: Date): string;
    };
    interface: {
        getAllIps(): string[];
        getBeautyStrOfIp(port: number, proxy?: string): string;
    };
    file: {
        exists: (filename: string) => Promise<fs.Stats>;
        existsSync: (filename: string) => fs.Stats;
        fileExists: (filename: string) => Promise<{}>;
        fileExistsSync: (filename: string) => boolean;
        directoryExists: (filename: string) => Promise<{}>;
        directoryExistsSync: (filename: string) => boolean;
    };
    merge: {
        default: (obj1: any, obj2: any) => any;
        deep: (obj1: any, obj2: any, obj2p?: any[]) => any;
    };
};
export default util;
