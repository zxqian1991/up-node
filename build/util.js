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
    array: {},
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
                me.exists(filename).then(function (stat) {
                    resolve(stat ? stat.isFile() : false);
                });
            });
        },
        fileExistsSync: function (filename) {
            var me = this;
            var stat = me.existsSync(filename);
            return stat ? stat.isFile() : false;
        },
        directoryExists: function (filename) {
            var me = this;
            return new Promise(function (resolve, reject) {
                me.exists(filename).then(function (stat) {
                    resolve(stat ? stat.isDirectory() : false);
                });
            });
        },
        directoryExistsSync: function (filename) {
            var me = this;
            var stat = me.existsSync(filename);
            return stat ? stat.isDirectory() : false;
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
                            obj1[i] = me.deep(obj1[i], obj2[i], obj2p.concat([obj2[i]]));
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
