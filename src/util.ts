import * as path from "path";
import * as colors from "colors";
import * as os from "os";
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
        getLocalDateString(date : Date = new Date(), ifBeauty : boolean = true) {
            let str = date.toLocaleString();
            return ifBeauty
                ? `[${str.gray}]`
                : str;
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
        getBeautyStrOfIp(port : number,proxy: string = 'http'):string {
            let me = this;
            let str = '';
            me.getAllIps().forEach((ip:string,index:number)=>{
                str += `\n${proxy}://${ip}:${port}`.green
            });
            return str;
        }
    }
};
export {util}