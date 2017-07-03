"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log4js = require("log4js");
var path = require("path");
var util_1 = require("./util");
var cwd = process.cwd();
var logs = [
    "trace",
    "debug",
    "info",
    "warn",
    "error",
    "fatal"
];
function getDefaultConfig() {
    var obj = {
        root: path.join(cwd, "logs"),
        files: {}
    };
    logs.forEach(function (value, index) {
        obj.files[value] = {
            date: true,
            filename: value + ".log"
        };
    });
    return obj;
}
;
function getDefaultAppenders(config) {
    var appenders = [];
    var levels = {};
    var root = config.root || cwd;
    for (var type in config.files) {
        appenders.push({
            type: "console",
            category: [type + "-console", type],
        });
        appenders.push({
            type: config.files[type].date ? "DateFile" : "file",
            filename: util_1.default.path.getFullPath(config.files[type].filename ? config.files[type].filename : type + ".log", root),
            pattern: "-yyyy-MM-dd.log",
            alwaysIncludePattern: true,
            category: [type + "-file", type]
        });
        levels[type] = type;
        levels[type + "-console"] = type;
    }
    ;
    log4js.configure({
        appenders: appenders,
        levels: levels
    });
}
var UnionLog = (function () {
    function UnionLog(config) {
        var me = this;
        me.initConfig(config);
        me.initLoggers();
    }
    ;
    // 初始化配置项
    UnionLog.prototype.initConfig = function (config) {
        var me = this;
        config = config || {};
        // 如果是路径，加载该路径下内容
        if (util_1.default.type.isString(config) && util_1.default.file.fileExistsSync(config)) {
            config = require(util_1.default.path.getFullPath(config));
        }
        ;
        me.config = util_1.default
            .merge
            .deep(getDefaultConfig(), config);
        return me.config;
    };
    ;
    // type 0 都输出 1 console  2 file
    UnionLog.prototype.log = function (content, level, type) {
        if (level === void 0) { level = "trace"; }
        if (type === void 0) { type = 0; }
        var me = this;
        var category = type == 0 ? "" + level : (type == 1 ? level + "-console" : level + "-file");
        var logger = log4js.getLogger(category);
        logger[level](content);
    };
    ;
    UnionLog.prototype.initLoggers = function () {
        var me = this;
        getDefaultAppenders(me.config);
    };
    ;
    UnionLog.prototype.getDefaultOptionConfig = function (type) {
        var me = this;
        return {
            useDefault: false,
            root: cwd,
            config: {
                filename: "trace/" + type + ".log",
                date: true,
                path: []
            }
        };
    };
    ;
    UnionLog.prototype.trace = function (content, type
        // 后续支持，意义不大
    ) {
        if (type === void 0) { type = 0; }
        var me = this;
        me.log(content, "trace", type);
    };
    ;
    UnionLog.prototype.debug = function (content, type) {
        if (type === void 0) { type = 0; }
        var me = this;
        me.log(content, "debug", type);
    };
    ;
    UnionLog.prototype.info = function (content, type) {
        if (type === void 0) { type = 0; }
        var me = this;
        me.log(content, "info", type);
    };
    ;
    UnionLog.prototype.warn = function (content, type) {
        if (type === void 0) { type = 0; }
        var me = this;
        me.log(content, "warn", type);
    };
    ;
    UnionLog.prototype.error = function (content, type) {
        if (type === void 0) { type = 0; }
        var me = this;
        me.log(content, "error", type);
    };
    ;
    UnionLog.prototype.fatal = function (content, type) {
        if (type === void 0) { type = 0; }
        var me = this;
        me.log(content, "fatal", type);
    };
    ;
    return UnionLog;
}());
exports.default = UnionLog;
;
;
