import "colors";
import * as Koa from "koa";
import * as path from "path";
import defaultConfig from "./default.config";
import {getFullPath} from "./utils/path";
import UnionLog from "./logger";
import { UnionAppConfig } from './default.config';
import { getBeautyStrOfIp } from './utils/interface';
import { deep } from './utils/merge';
import { UnionPlugins } from './plugins/index';
export class UnionApp {
    constructor(config : UnionAppConfig | string) {
        let me = this;
        if(!config || typeof config == "string") {
            config = require(getFullPath((config as string) || "upp.config.js"))
        };
        me.initConfig(config).then(async ()=>{
            me.logger = new UnionLog(me.config.logger);
            me.logger.info(`正在启动程序请稍后...`.blue);
            process.env.PORT = me.config.port.toString();
            me.app = new Koa();
            await me.initApp();
            me.app.listen(me.config.port);
            me.logger.info(`程序已启动,请访问${getBeautyStrOfIp(me.config.port)}`.cyan);
            let logger = UnionLog.getLogger("qianzhixiang");
        });
    };
    logger: UnionLog;
    app: Koa;
    config: UnionAppConfig;
    plugins: UnionPlugins;
    // 初始化配置
    async initConfig(config:any){
        let me = this;
        me.config = deep(defaultConfig,config);
    };
    // 初始化app
    async initApp(){
        let me = this;
        me.plugins = new UnionPlugins(me.config.plugins,me.app);
    }
};