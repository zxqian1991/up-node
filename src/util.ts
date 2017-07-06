import * as path from "path";
import {existsSync} from 'fs';
import * as os from 'os';
import * as fs from "fs";
const util = {
    path: {
        getFullPath(url : string = "", pre : string = process.cwd()) {
            return path.isAbsolute(url)
                ? url
                : path.join(pre, url);
        }
    },
    type: {
        isObject(value : any) {
            return typeof value == "object";
        },
        isArray(value : any) {
            return typeof value == "object" && value instanceof Array;
        },
        isPromise(value : any) {
            return value instanceof Promise;
        },
        isIterator(value : any) {
            return value.hasOwnProperty(Symbol.iterator);
        },
        isString(value : any) {
            return typeof value == "string";
        },
        isNumber(value : any) {
            return typeof value == "number";
        },
        isBoolean(value : any) {
            return typeof value == "boolean";
        },
        isSymbol(value : any) {
            return typeof value == "symbol";
        },
        isUndefined(value : any) {
            return value === undefined;
        },
        isNull(value : any) {
            return value === null;
        },
        isNaN(value : any) {
            return isNaN(value);
        }
    },
    array: {
        orderByKey(arr : any[], key : string, ifasync : boolean = true) {
            return this.order(arr, function (obj : any) {
                return obj[key];
            });
        },
        // 快速排序
        quick(arr : any[], ifasync : boolean = true,ifUseNew : boolean = false, getValue?: Function) {
            
        },
        // 堆排序
        heap(arr : any[], ifasync : boolean = true,ifUseNew : boolean = false, getValue?: Function) {
            let res = ifUseNew
                ? [...arr]
                : arr;
            getValue = getValue || function (value : any) {
                return value;
            };
            function exchange(res: any[],i:number,j:number) {
                let tmp = res[i];
                res[i] = res[j];
                res[j] = tmp;
            }
            let count = 0;
            // 自动调整二叉树，保证最上面的是最大的
            function just(index:number){
                let left = index * 2 + 1;
                let right = index * 2 + 2;
                if(left < res.length - count) {
                    // 说明没到底
                    let maxindex = right < res.length - count
                    ? (
                        getValue(res[right]) > getValue(res[left])
                        ? (ifasync ? right : left)
                        : (ifasync ? left : right)
                    )
                    : (
                        left
                    );
                    if(ifasync ? getValue(res[maxindex]) > getValue(res[index]) : getValue(res[maxindex]) < getValue(res[index])) {
                        exchange(res,index,maxindex);
                        just(maxindex);
                    };
                }
            };
            // 初始化
            for(let i = Math.floor((res.length - 1)/2);i >= 0;i--) {
                just(i);
            };
            // 交换
            exchange(res,0,res.length - 1);
            count++;
            let times = res.length - count;
            for(let i = 0; i < times;i++) {
                just(0);
                exchange(res,0,res.length - count - 1);
                count++;
            };
            return res;
        },
        // 归并排序  由于需要用到临时数组
        merge(arr : any[], ifasync : boolean = true, ifUseNew : boolean = false, getValue?: Function, begin : number = 0, end : number = arr.length - 1, ifFirst : boolean = true): any[] {
            let me = this;
            getValue = getValue || function (value : any) {
                return value;
            };
            if (begin != end) {
                let middle = Math.floor((begin + end) / 2);
                let left : any[] = util
                    .array
                    .merge(arr, ifasync,ifUseNew, getValue,  begin, middle, false);
                let right : any[] = util
                    .array
                    .merge(arr, ifasync, ifUseNew, getValue, middle + 1, end, false);
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

        },
        // 冒泡排序，，默认改变原数组，所以额外有个ifUseNew选项，
        bubble(arr : any[], ifUseNew : boolean = false, getValue?: Function, ifasync : boolean = true) {
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
    },
    math: {},
    date: {
        getLocalDateString(date : Date = new Date()) {
            let str = date.toLocaleString();
            return str;
        }
    },
    interface: {
        getAllIps(): Array < string > {
            let res: string[] = [];
            let ifaces = os.networkInterfaces();
            for (let dev in ifaces) {
                ifaces[dev]
                    .forEach(function (details, alias) {
                        if (details.family == 'IPv4') {
                            res.push(details.address);
                        }
                    })
            };
            return res;
        },
        getBeautyStrOfIp(port : number, proxy : string = 'http'): string {
            let me = this;
            let str = '';
            me
                .getAllIps()
                .forEach((ip : string, index : number) => {
                    str += `\n${proxy}://${ip}:${port}`
                });
            return str;
        }
    },
    file: {
        exists: function (filename : string): Promise < fs.Stats > {
            return new Promise((resolve, reject) => {
                try {
                    filename = path.isAbsolute(filename)
                        ? filename
                        : path.join(process.cwd(), filename);
                    fs.stat(filename, function (err, stat) {
                        resolve(err
                            ? null
                            : stat);
                    })

                } catch (e) {
                    console.log(e);
                    resolve(null);
                }
            })
        },
        existsSync: function (filename : string): fs.Stats {
            filename = path.isAbsolute(filename)
                ? filename
                : path.join(process.cwd(), filename);
            try {
                let stat : fs.Stats = fs.statSync(filename);
                return stat;
            } catch (e) {
                console.log(e);
                return null;
            }
        },
        fileExists: function (filename : string) {
            let me = this;
            return new Promise((resolve, reject) => {
                me
                    .exists(filename)
                    .then((stat : fs.Stats) => {
                        resolve(stat
                            ? stat.isFile()
                            : false);
                    })
            })
        },
        fileExistsSync: function (filename : string) {
            let me = this;
            let stat : fs.Stats = me.existsSync(filename);
            return stat
                ? stat.isFile()
                : false;
        },
        directoryExists: function (filename : string) {
            let me = this;
            return new Promise((resolve, reject) => {
                me
                    .exists(filename)
                    .then((stat : fs.Stats) => {
                        resolve(stat
                            ? stat.isDirectory()
                            : false);
                    })
            })
        },
        directoryExistsSync: function (filename : string) {
            let me = this;
            let stat : fs.Stats = me.existsSync(filename);
            return stat
                ? stat.isDirectory()
                : false;
        }
    },
    merge: {
        default: function (obj1 : any, obj2 : any) {
            let type1 : string = typeof obj1;
            let type2 : string = typeof obj2;
            if (type1 == "object" && type2 == "object" && !(obj2 instanceof Array)) {
                for (let i in obj2) {
                    obj1[i] = obj2[i];
                };
                return obj1;
            };
            return obj2;
        },
        // 深度复制  需要考虑循环引用
        deep: function (obj1 : any, obj2 : any, obj2p : any[] = [obj2]) {
            let me = this;
            let type1 = typeof obj1;
            let type2 = typeof obj2;
            if (type1 == "object" && type2 == "object" && !(obj2 instanceof Array)) {
                for (let i in obj2) {
                    if (!obj1.hasOwnProperty(i)) {
                        obj1[i] = obj2[i];
                    } else {
                        if (obj2p.indexOf(obj2[i]) >= 0) {
                            // 存在循环引用
                            obj1[i] = obj2[i];
                        } else {
                            // 不存在
                            obj1[i] = me.deep(obj1[i], obj2[i], [
                                ...obj2p,
                                obj2[i]
                            ]);
                        }
                    }
                }
                return obj1;
            };
            return obj2;
        }
    }
};
export default util