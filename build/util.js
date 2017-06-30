"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var os = require("os");
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
        getLocalDateString: function (date, ifBeauty) {
            if (date === void 0) { date = new Date(); }
            if (ifBeauty === void 0) { ifBeauty = true; }
            var str = date.toLocaleString();
            return ifBeauty
                ? "[" + str.gray + "]"
                : str;
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
            me.getAllIps().forEach(function (ip, index) {
                str += ("\n" + proxy + "://" + ip + ":" + port).green;
            });
            return str;
        }
    }
};
exports.util = util;
