import "colors";
export function exchange(res : any[], i : number, j : number) {
    let tmp = res[i];
    res[i] = res[j];
    res[j] = tmp;
}
export function order(arr:any[],ifasyn:boolean = true,ifnew: boolean = false,getValue?: Function){
    return merge(arr,ifasyn,ifnew,getValue);
}
export function orderByKey(arr : any[], key : string, ifasync : boolean,ifnew:boolean) {
    return order(arr,ifasync,ifnew,function(value:any){
        return value[key];
    });
}
// 快速排序  从右向左
export function quickPro(arr : any[], ifasync : boolean = true, ifUseNew : boolean = false, getValue?: Function, begin : number = 0, end : number = arr.length - 1){
    let res = ifUseNew
        ? [...arr]
        : arr;
    getValue = getValue || function (value : any) {
        return value;
    };
    if(begin >= end || end < 0) {
        return res;
    };
    // function log(index:number,left:number,right:number){
    //     let str = '';
    //     console.log(begin,end,index,left,right);
    //     res.forEach((value:number | string,i:number)=>{
    //         value += "";

    //         let _str = i == index 
    //         ? (value as string).green 
    //         : (i == left ? (value as string).bgBlue :(i == right ? (value as string).bgRed : value) );
    //         if(left == right && i == left) {
    //             _str = (_str as string).cyan;
    //         }
    //         str += _str + " ";
    //     });
    //     console.log(str);
    // }
    function sort():number{
        let value = getValue(res[begin]);
        let index = begin;
        let left = begin + 1;
        let right = end;
        // log(index,left,right);
        while(right > index) {
            if(getValue(res[right]) < value) {
                res[index] = res[right];
                index = right;
                right--;
                // log(index,left,right);
                while(left < index) {
                    if(getValue(res[left]) > value) {
                        res[index] = res[left];
                        index = left;
                        left++;
                        // log(index,left,right);
                        break;
                    } else {
                        left++;
                        // log(index,left,right);
                    }
                }
            } else {
                right--;
                // log(index,left,right);
            }
        };
        res[index] = value;
        // log(index,left,right);
        // console.log(res);
        return index;
    };
    let index = sort();
    quickPro(arr,ifasync,false,getValue,begin,index - 1);
    quickPro(arr,ifasync,false,getValue,index + 1,end);
    return res;
}
// 快速排序 从左向右
export function quick(arr : any[], ifasync : boolean = true, ifUseNew : boolean = false, getValue?: Function, begin : number = 0, end : number = arr.length - 1) {
    let res = ifUseNew
        ? [...arr]
        : arr;
    getValue = getValue || function (value : any) {
        return value;
    };
    // 根据键值排序
    function sort() : number {
        // 找到中间点
        if(begin > end || end < 0) 
            return -1;
        let index = begin;
        let value = getValue(res[index]);
        let left = begin + 1;
        let right = end;
        if (left == right) {
            if (ifasync
                ? getValue(res[left]) < value
                : getValue(res[left]) > value) {
                res[left - 1] = res[left];
                index = left;
            }
        }
        while (left < right || (left == right && right == end)) {
            if (ifasync
                ? getValue(res[left]) < value
                : getValue(res[left]) > value) {
                res[left - 1] = res[left];
                index = left;
            } else {
                while ((ifasync
                    ? getValue(res[right]) > value
                    : getValue(res[right]) < value) && right > left) {
                    right--;
                }
                if (right > left) {
                    exchange(res, left, right);
                    res[left - 1] = res[left];
                    index = left;
                };
            }
            left++;
        };
        res[index] = value;
        return index;
    };
    let index = sort();
    if (index >= 0) {
        quick(res, ifasync, false, getValue, begin, index - 1);
        quick(res, ifasync, false, getValue, index + 1, end);
    }
    return res;
}
// 堆排序
export function heap(arr : any[], ifasync : boolean = true, ifUseNew : boolean = false, getValue?: Function) {
    let res = ifUseNew
        ? [...arr]
        : arr;
    getValue = getValue || function (value : any) {
        return value;
    };
    let count = 0;
    // 自动调整二叉树，保证最上面的是最大的
    function just(index : number) {
        let left = index * 2 + 1;
        let right = index * 2 + 2;
        if (left < res.length - count) {
            // 说明没到底
            let maxindex = right < res.length - count
                ? (getValue(res[right]) > getValue(res[left])
                    ? (ifasync
                        ? right
                        : left)
                    : (ifasync
                        ? left
                        : right))
                : (left);
            if (ifasync
                ? getValue(res[maxindex]) > getValue(res[index])
                : getValue(res[maxindex]) < getValue(res[index])) {
                exchange(res, index, maxindex);
                just(maxindex);
            };
        }
    };
    // 初始化
    for (let i = Math.floor((res.length - 1) / 2); i >= 0; i--) {
        just(i);
    };
    // 交换
    exchange(res, 0, res.length - 1);
    count++;
    let times = res.length - count;
    for (let i = 0; i < times; i++) {
        just(0);
        exchange(res, 0, res.length - count - 1);
        count++;
    };
    return res;
}
// 归并排序  由于需要用到临时数组
export function merge(arr : any[], ifasync : boolean = true, ifUseNew : boolean = false, getValue?: Function, begin : number = 0, end : number = arr.length - 1, ifFirst : boolean = true) : any[] {
    let me = this;
    getValue = getValue || function (value : any) {
        return value;
    };
    if (begin != end) {
        let middle = Math.floor((begin + end) / 2);
        let left : any[] = merge(arr, ifasync, ifUseNew, getValue, begin, middle, false);
        let right : any[] = merge(arr, ifasync, ifUseNew, getValue, middle + 1, end, false);
        let tp : any[] = !(!ifUseNew && ifFirst)
            ? []
            : arr;
        let j = 0;
        let index = begin;
        let i_begin = !(!ifUseNew && ifFirst)
            ? 0
            : begin;
        let i_end = (!(!ifUseNew && ifFirst)
            ? left.length - 1
            : middle);
        for (let i = i_begin; i <= i_end; i++) {
            while (j < right.length && (ifasync
                ? getValue(right[j]) < getValue(left[i])
                : getValue(right[j]) < getValue(left[i]))) {
                if (!(!ifUseNew && ifFirst)) {
                    tp.push(right[j])
                } else {
                    tp[index] = right[j];
                    index++;
                }
                j++;
            };
            if (!(!ifUseNew && ifFirst)) {
                tp.push(left[i])
            } else {
                tp[index] = left[i];
                index++;
            }
        };
        let j_end = right.length - 1;
        for (let i = j; i <= j_end; i++) {
            if (!(!ifUseNew && ifFirst)) {
                tp.push(right[i])
            } else {
                tp[index] = right[i];
                index++;
            }
        }
        return tp;
    } else {
        return ifUseNew && ifFirst
            ? arr
            : [arr[begin]];
    }

}
// 冒泡排序，，默认改变原数组，所以额外有个ifUseNew选项，
export function bubble(arr : any[], ifUseNew : boolean = false, getValue?: Function, ifasync : boolean = true) {
    let res = ifUseNew
        ? []
        : arr;
    getValue = getValue || function (value : any) {
        return value;
    };
    if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                if (i == 0 && ifUseNew) {
                    if (j == 1) {
                        res.push(arr[i]);
                    }
                    res.push(arr[j]);
                }
                let value_j = getValue(res[j]);
                let value_i = getValue(res[i]);
                if (ifasync
                    ? value_j < value_i
                    : value_j > value_i) {
                    let _tp = res[i];
                    res[i] = res[j];
                    res[j] = _tp;
                }
            }
        };
    };
    return res;
}