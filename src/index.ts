require("colors");
import * as Koa from "koa";
import * as path from "path";
import defaultConfig from "./default.config";
import {util} from "./util";
import { UnionAppConfig } from './default.config';
export class UnionApp {
    constructor(config : UnionAppConfig) {
        let me = this;
        me.config = config;
        console.log(util.date.getLocalDateString() ,`正在启动程序请稍后...`.blue);
        me.initConfig().then(async ()=>{
            process.env.PORT = me.config.port.toString();
            me.app = new Koa();
            me.app.listen(me.config.port);
            console.log(`${util.date.getLocalDateString()}`,`程序已启动,请访问`.yellow,`${util.interface.getBeautyStrOfIp(me.config.port)}`);
        })
    };
    app: Koa;
    config: UnionAppConfig;
    // 初始化配置
    async initConfig() {

    };
};