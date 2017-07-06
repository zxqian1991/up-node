export declare function reduce(arr: any[], func: (value?: any, index?: number, v?: number) => any): Promise<any>;
export declare function map(arr: any[], func: (value?: any, index?: number) => any): Promise<any[]>;
export declare function find(arr: any[], func: (value?: any, index?: number) => any): Promise<number>;
/**
 * 1. 找到某个值，在之后插入
 * 2. 找到某个值,在之前插入
 * 3. 有个记录值
 * {
 *     state: boolean; // true 找到 false 没找到
 *     index: number;
 *     other
 * }
 */
export interface FindPExtraValue {
    findIndex?: number;
    index: number;
    [prop: string]: any;
}
export declare function findPro(arr: any[], func: (value?: any, index?: number, extra?: FindPExtraValue) => any): Promise<FindPExtraValue>;
