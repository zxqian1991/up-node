"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var os = require("os");
var fs = require("fs");
var util = {
    path: {
        getFullPath: function (url, pre) {
            if (url === void 0) { url = ""; }
            if (pre === void 0) { pre = process.cwd(); }
            return path.isAbsolute(url)
                ? url
                : path.join(pre, url);
        }
    },
    type: {
        isObject: function (value) {
            return typeof value == "object";
        },
        isArray: function (value) {
            return typeof value == "object" && value instanceof Array;
        },
        isPromise: function (value) {
            return value instanceof Promise;
        },
        isIterator: function (value) {
            return value.hasOwnProperty(Symbol.iterator);
        },
        isString: function (value) {
            return typeof value == "string";
        },
        isNumber: function (value) {
            return typeof value == "number";
        },
        isBoolean: function (value) {
            return typeof value == "boolean";
        },
        isSymbol: function (value) {
            return typeof value == "symbol";
        },
        isUndefined: function (value) {
            return value === undefined;
        },
        isNull: function (value) {
            return value === null;
        },
        isNaN: function (value) {
            return isNaN(value);
        }
    },
    array: {
        orderByKey: function (arr, key, ifasync) {
            if (ifasync === void 0) { ifasync = true; }
            return this.order(arr, function (obj) {
                return obj[key];
            });
        },
        // 快速排序
        quick: function (arr, ifasync, ifUseNew, getValue) {
            if (ifasync === void 0) { ifasync = true; }
            if (ifUseNew === void 0) { ifUseNew = false; }
        },
        // 堆排序
        heap: function (arr, ifasync, ifUseNew, getValue) {
            if (ifasync === void 0) { ifasync = true; }
            if (ifUseNew === void 0) { ifUseNew = false; }
            var res = ifUseNew
                ? arr.slice() : arr;
            getValue = getValue || function (value) {
                return value;
            };
            function exchange(res, i, j) {
                var tmp = res[i];
                res[i] = res[j];
                res[j] = tmp;
            }
            var count = 0;
            // 自动调整二叉树，保证最上面的是最大的
            function just(index) {
                var left = index * 2 + 1;
                var right = index * 2 + 2;
                if (left < res.length - count) {
                    // 说明没到底
                    var maxindex = right < res.length - count
                        ? (getValue(res[right]) > getValue(res[left])
                            ? (ifasync ? right : left)
                            : (ifasync ? left : right))
                        : (left);
                    if (ifasync ? getValue(res[maxindex]) > getValue(res[index]) : getValue(res[maxindex]) < getValue(res[index])) {
                        exchange(res, index, maxindex);
                        just(maxindex);
                    }
                    ;
                }
            }
            ;
            // 初始化
            for (var i = Math.floor((res.length - 1) / 2); i >= 0; i--) {
                just(i);
            }
            ;
            // 交换
            exchange(res, 0, res.length - 1);
            count++;
            var times = res.length - count;
            for (var i = 0; i < times; i++) {
                just(0);
                exchange(res, 0, res.length - count - 1);
                count++;
            }
            ;
            return res;
        },
        // 归并排序  由于需要用到临时数组
        merge: function (arr, ifasync, ifUseNew, getValue, begin, end, ifFirst) {
            if (ifasync === void 0) { ifasync = true; }
            if (ifUseNew === void 0) { ifUseNew = false; }
            if (begin === void 0) { begin = 0; }
            if (end === void 0) { end = arr.length - 1; }
            if (ifFirst === void 0) { ifFirst = true; }
            var me = this;
            getValue = getValue || function (value) {
                return value;
            };
            if (begin != end) {
                var middle = Math.floor((begin + end) / 2);
                var left = util
                    .array
                    .merge(arr, ifasync, ifUseNew, getValue, begin, middle, false);
                var right = util
                    .array
                    .merge(arr, ifasync, ifUseNew, getValue, middle + 1, end, false);
                var tp = !(!ifUseNew && ifFirst)
                    ? []
                    : arr;
                var j = 0;
                var index = begin;
                var i_begin = !(!ifUseNew && ifFirst)
                    ? 0
                    : begin;
                var i_end = (!(!ifUseNew && ifFirst)
                    ? left.length - 1
                    : middle);
                for (var i = i_begin; i <= i_end; i++) {
                    while (j < right.length && (ifasync
                        ? getValue(right[j]) < getValue(left[i])
                        : getValue(right[j]) < getValue(left[i]))) {
                        if (!(!ifUseNew && ifFirst)) {
                            tp.push(right[j]);
                        }
                        else {
                            tp[index] = right[j];
                            index++;
                        }
                        j++;
                    }
                    ;
                    if (!(!ifUseNew && ifFirst)) {
                        tp.push(left[i]);
                    }
                    else {
                        tp[index] = left[i];
                        index++;
                    }
                }
                ;
                var j_end = right.length - 1;
                for (var i = j; i <= j_end; i++) {
                    if (!(!ifUseNew && ifFirst)) {
                        tp.push(right[i]);
                    }
                    else {
                        tp[index] = right[i];
                        index++;
                    }
                }
                return tp;
            }
            else {
                return ifUseNew && ifFirst
                    ? arr
                    : [arr[begin]];
            }
        },
        // 冒泡排序，，默认改变原数组，所以额外有个ifUseNew选项，
        bubble: function (arr, ifUseNew, getValue, ifasync) {
            if (ifUseNew === void 0) { ifUseNew = false; }
            if (ifasync === void 0) { ifasync = true; }
            var res = ifUseNew
                ? []
                : arr;
            getValue = getValue || function (value) {
                return value;
            };
            if (arr && arr.length > 0) {
                for (var i = 0; i < arr.length - 1; i++) {
                    for (var j = i + 1; j < arr.length; j++) {
                        if (i == 0 && ifUseNew) {
                            if (j == 1) {
                                res.push(arr[i]);
                            }
                            res.push(arr[j]);
                        }
                        var value_j = getValue(res[j]);
                        var value_i = getValue(res[i]);
                        if (ifasync
                            ? value_j < value_i
                            : value_j > value_i) {
                            var _tp = res[i];
                            res[i] = res[j];
                            res[j] = _tp;
                        }
                    }
                }
                ;
            }
            ;
            return res;
        }
    },
    math: {},
    date: {
        getLocalDateString: function (date) {
            if (date === void 0) { date = new Date(); }
            var str = date.toLocaleString();
            return str;
        }
    },
    interface: {
        getAllIps: function () {
            var res = [];
            var ifaces = os.networkInterfaces();
            for (var dev in ifaces) {
                ifaces[dev]
                    .forEach(function (details, alias) {
                    if (details.family == 'IPv4') {
                        res.push(details.address);
                    }
                });
            }
            ;
            return res;
        },
        getBeautyStrOfIp: function (port, proxy) {
            if (proxy === void 0) { proxy = 'http'; }
            var me = this;
            var str = '';
            me
                .getAllIps()
                .forEach(function (ip, index) {
                str += "\n" + proxy + "://" + ip + ":" + port;
            });
            return str;
        }
    },
    file: {
        exists: function (filename) {
            return new Promise(function (resolve, reject) {
                try {
                    filename = path.isAbsolute(filename)
                        ? filename
                        : path.join(process.cwd(), filename);
                    fs.stat(filename, function (err, stat) {
                        resolve(err
                            ? null
                            : stat);
                    });
                }
                catch (e) {
                    console.log(e);
                    resolve(null);
                }
            });
        },
        existsSync: function (filename) {
            filename = path.isAbsolute(filename)
                ? filename
                : path.join(process.cwd(), filename);
            try {
                var stat = fs.statSync(filename);
                return stat;
            }
            catch (e) {
                console.log(e);
                return null;
            }
        },
        fileExists: function (filename) {
            var me = this;
            return new Promise(function (resolve, reject) {
                me
                    .exists(filename)
                    .then(function (stat) {
                    resolve(stat
                        ? stat.isFile()
                        : false);
                });
            });
        },
        fileExistsSync: function (filename) {
            var me = this;
            var stat = me.existsSync(filename);
            return stat
                ? stat.isFile()
                : false;
        },
        directoryExists: function (filename) {
            var me = this;
            return new Promise(function (resolve, reject) {
                me
                    .exists(filename)
                    .then(function (stat) {
                    resolve(stat
                        ? stat.isDirectory()
                        : false);
                });
            });
        },
        directoryExistsSync: function (filename) {
            var me = this;
            var stat = me.existsSync(filename);
            return stat
                ? stat.isDirectory()
                : false;
        }
    },
    merge: {
        default: function (obj1, obj2) {
            var type1 = typeof obj1;
            var type2 = typeof obj2;
            if (type1 == "object" && type2 == "object" && !(obj2 instanceof Array)) {
                for (var i in obj2) {
                    obj1[i] = obj2[i];
                }
                ;
                return obj1;
            }
            ;
            return obj2;
        },
        // 深度复制  需要考虑循环引用
        deep: function (obj1, obj2, obj2p) {
            if (obj2p === void 0) { obj2p = [obj2]; }
            var me = this;
            var type1 = typeof obj1;
            var type2 = typeof obj2;
            if (type1 == "object" && type2 == "object" && !(obj2 instanceof Array)) {
                for (var i in obj2) {
                    if (!obj1.hasOwnProperty(i)) {
                        obj1[i] = obj2[i];
                    }
                    else {
                        if (obj2p.indexOf(obj2[i]) >= 0) {
                            // 存在循环引用
                            obj1[i] = obj2[i];
                        }
                        else {
                            // 不存在
                            obj1[i] = me.deep(obj1[i], obj2[i], obj2p.concat([
                                obj2[i]
                            ]));
                        }
                    }
                }
                return obj1;
            }
            ;
            return obj2;
        }
    }
};
exports.default = util;
