/**
 * 日志记录器
 */
import {WSAENOTEMPTY} from 'constants';
import {appendFile} from 'fs';
import * as log4js from 'log4js';
import * as path from 'path';
import util from "./util"
import {UnionAppConfig} from './default.config';
const cwd : string = process.cwd();
const logs : string[] = [
    "trace",
    "debug",
    "info",
    "warn",
    "error",
    "fatal"
];
function getDefaultConfig() {
    let obj : any = {
        root: path.join(cwd, "logs"),
        files: {}
    };
    logs.forEach((value : string, index : number) => {
        obj.files[value] = {
            date: true,
            filename: `${value}.log`
        };
    });
    return obj;
};
function getDefaultAppenders(config : UnionLogConfig) {
    let appenders : any[] = [];
    let levels : {
        [category : string] : string
    } = {};
    let root = config.root || cwd;
    for (let type in config.files) {
        appenders.push({
            type: "console",
            category: [`${type}-console`, type]
        });
        appenders.push({
            type: config.files[type].date
                ? "DateFile"
                : "file",
            filename: util
                .path
                .getFullPath(config.files[type].filename
                    ? config.files[type].filename
                    : `${type}.log`, root),
            pattern: "-yyyy-MM-dd.log",
            alwaysIncludePattern: true,
            category: [`${type}-file`, type]
        });
        levels[type] = type;
        levels[`${type}-console`] = type;
    };
    log4js.configure({appenders: appenders, levels: levels});
}
export default class UnionLog {
    constructor(config : any) {
        let me = this;
        me.initConfig(config)
        me.initLoggers();
    };
    // 初始化配置项
    private initConfig(config : any) {
        let me = this;
        config = config || {};
        // 如果是路径，加载该路径下内容
        if (util.type.isString(config) && util.file.fileExistsSync(config)) {
            config = require(util.path.getFullPath(config));
        };
        me.config = util
            .merge
            .deep(getDefaultConfig(), config);
        return me.config;
    };
    private config : UnionLogConfig;
    private logger : log4js.Logger;
    // type 0 都输出 1 console  2 file
    private log(content : string, level : string = "trace", type : number = 0) {
        let me = this;
        let category = type == 0
            ? `${level}`
            : (type == 1
                ? `${level}-console`
                : `${level}-file`);
        let logger = log4js.getLogger(category);
        logger[level](content);
    };
    private initLoggers() {
        let me = this;
        getDefaultAppenders(me.config);
    };
    private getDefaultOptionConfig(type : string) : UnionLogOptionConfig {
        let me = this;
        return {
            useDefault: false, // 默认不使用默认的配置
            root: cwd, // 默认的根目录即使程序的启动目录
            config: {
                filename: `trace/${type}.log`,
                date: true,
                path: []
            }
        };
    };
    trace(content : string, type : number = 0
    // 后续支持，意义不大
    ) {
        let me = this;
        me.log(content, "trace", type);
    };
    debug(content : string, type : number = 0) {
        let me = this;
        me.log(content, "debug", type);
    };
    info(content : string, type : number = 0) {
        let me = this;
        me.log(content, "info", type);
    };
    warn(content : string, type : number = 0) {
        let me = this;
        me.log(content, "warn", type);
    };
    error(content : string, type : number = 0) {
        let me = this;
        me.log(content, "error", type);
    };
    fatal(content : string, type : number = 0) {
        let me = this;
        me.log(content, "fatal", type);
    };
    // 新增一个Logger
    static addLogger(config : {
        name: string;
        filename: string;
    }) {
        logs.forEach((type : string, index : number) => {
            let fileappender = {
                type: "DateFile",
                category: [`${type}-file-${config.name}`,`${type}-${config.name}`,`${type}-file`,`${type}`],
                filename: config.filename || `${config.name}-${type}.log`,
                pattern: "-yyyy-MM-dd.log",
                alwaysIncludePattern: true,
            };
            let consoleappender = {
                type: "console",
                category: [`${type}-${config.name}`,`${type}-console-${config.name}`,`${type}-console`,`${type}`],
            };
            log4js.addAppender(consoleappender);
        });
    };
    // 获取对应的logger
    static getLogger(type: string){
        return new UnionSingleLogger(type);
    }
    // 动态的添加到某个文件中呢？怎么将内容动态的添加到某个动态的地址中
};
export class UnionSingleLogger {
    constructor(name: string){
        let me = this;
        me.name = name;
    };
    private name: string;
    private log(logtype: string,content: string,outtype : number = 0){
        let me = this;
        let str = outtype == 0 ? `${logtype}-${me.name}` : (outtype == 1 ? `${logtype}-console-${me.name}` : (outtype == 2 ? `${logtype}-file-${me.name}` : `${logtype}`));
        let logger = log4js.getLogger(str);
        logger[logtype](content);
    }
    trace(content: string,type : number = 0){
        let me = this;
        me.log("trace",content,type);
    };
    debug(content: string,type : number = 0){
        let me = this;
        me.log("debug",content,type);
    };
    info(content: string,type : number = 0){
        let me = this;
        me.log("info",content,type);
    };
    warn(content: string,type : number = 0){
        let me = this;
        me.log("warn",content,type);
    };
    error(content: string,type : number = 0){
        let me = this;
        me.log("error",content,type);
    };
    fatal(content: string,type : number = 0){
        let me = this;
        me.log("fatal",content,type);
    };
}
export interface UnionLogConfig {
    root : string;
    files : {
        [props : string]: {
            date: boolean;
            filename: string;
            path?: string | string[]
        }
    },
    layout?: string;
};
export interface UnionLogOptionConfig {
    useDefault?: boolean; // 是否使用默认配置
    root?: string | string[]; // 使用自定义的存放路径  根路径
    config?: {
        filename: string; // 保存的文件名称
        date: boolean; // 是否使用日期格式
        path?: string | string[]; // 相对于root的路径
    }
}