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
    array: {},
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
        existsSync: function (filename : string):fs.Stats {
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
                me.exists(filename).then((stat : fs.Stats) => {
                    resolve(stat ? stat.isFile() : false);
                })
            })
        },
        fileExistsSync: function (filename : string) {
            let me = this;
            let stat: fs.Stats = me.existsSync(filename);
            return stat ? stat.isFile() : false;
        },
        directoryExists: function (filename : string) {
            let me = this;
            return new Promise((resolve, reject) => {
                me.exists(filename).then((stat : fs.Stats) => {
                    resolve(stat ? stat.isDirectory() : false);
                })
            })
        },
        directoryExistsSync: function (filename : string) {
            let me = this;
            let stat: fs.Stats = me.existsSync(filename);
            return stat ? stat.isDirectory() : false;
        }
    },
    merge: {
        default: function(obj1:any,obj2:any){
            let type1:string = typeof obj1;
            let type2:string = typeof obj2;
            if(type1 == "object" && type2 == "object" && !(obj2 instanceof Array)) {
                for(let i in obj2) {
                    obj1[i] = obj2[i];
                };
                return obj1;
            };
            return obj2;
        },
        // 深度复制  需要考虑循环引用
        deep: function(obj1:any,obj2:any,obj2p: any[] = [obj2]){
            let me = this;
            let type1 = typeof obj1;
            let type2 = typeof obj2;
            if(type1 == "object" && type2 == "object" && !(obj2 instanceof Array)) {
                for(let i in obj2) {
                    if(!obj1.hasOwnProperty(i)) {
                        obj1[i] = obj2[i];
                    } else {
                        if(obj2p.indexOf(obj2[i]) >= 0) {
                            // 存在循环引用
                            obj1[i] = obj2[i];
                        } else {
                            // 不存在
                            obj1[i] = me.deep(obj1[i],obj2[i],[...obj2p,obj2[i]]);
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