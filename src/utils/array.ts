// 归并
export async function reduce(arr : any[], func : (value? : any, index? : number, v? : number) => any) {
    let i = 0;
    let value : any = null;
    async function tmp() {
        if (i < arr.length) {
            value = await func(arr[i], i, value);
            i++;
            await tmp();
        }
    };
    await tmp();
    return value;
};
// 遍历数组
export async function map(arr : any[], func : (value? : any, index? : number) => any) {
    let i = 0;
    let res : any[] = [];
    async function tmp() {
        if (i < arr.length) {
            res.push(await func(arr[i], i));
            i++;
            await tmp();
        }
    };
    await tmp();
    return res;
};
// 查找某个元素
export async function find(arr : any[], func : (value? : any, index? : number) => any) {
    let i = 0;
    let findIndex:number = null;
    async function tmp(){
        if(i < arr.length) {
            // 返回false继续查找
            if(!await func(arr[i],i)) {
                i++;
                await tmp();
            } else {
                // 返回true 表示是需要的
                findIndex = i;
            }
        }
    };
    await tmp();
    return findIndex;
};
// 有时需要有这样的一个情况，就是我要搜查某个数组的中的符合条件的值，但是，我可能并不是针对这个条件进行处理，比如插入，
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
};
export async function findPro(arr:any[],func:(value?:any,index?:number,extra?: FindPExtraValue)=>any){
    let i = 0;
    let findIndex:number = null;
    // 默认是从第一个位置插入
    let extra:FindPExtraValue = {
        index: 0
    };
    async function tmp(){
        if(i < arr.length) {
            // 返回false继续查找
            if(!await func(arr[i],i,extra)) {
                i++;
                await tmp();
            } else {
                // 返回true 表示是需要的
                findIndex = i;
            }
        }
    };
    await tmp();
    extra.findIndex = findIndex;
    return extra;
};