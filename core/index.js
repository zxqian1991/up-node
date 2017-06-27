const staticHandler = require("./static.handler");
const defaultConfig = require("./default.config");
const routerHandler = require("./router.handler");
const rx = require("rxjs");
const fs = require("fs");
const path = require("path");
const watchConfig = require("./watch.config");
const colors = require("colors");
const getStatusColor = require("./getStatusColor");
module.exports = function(app, configpath) {
    let _origin_config;
    try {
        _origin_config = require(configpath)
    } catch (e) {
        console.log(e);
    }
    config = Object.assign({}, defaultConfig, _origin_config);
    app.use(async function(ctx, next) {
            let begin = new Date();
            await next();
            let end = new Date();
            let status = (ctx.status + "")[getStatusColor(ctx.status)]
            console.log(`[${begin.toDateString()}]`, `${ctx.host} `.cyan, `${ctx.request.method} `.green, `${ctx.url}`.yellow, status, `${end.getTime() - begin.getTime()}ms`.bgBlue);
        })
        // 静态目录的管理
    app.use(staticHandler(config.static));
    // 路由目录的处理
    app.use(routerHandler(config.routers));
    // 监听文件
    app.listen(config.port);
    let subject = watchConfig(configpath);
    subject.subscribe((value) => {
        if (value) {
            if (value.filename != path.basename(configpath)) {
                configpath = value.configpath;
            }
            delete require.cache[configpath];
            let _origin_config;
            try {
                _origin_config = require(configpath)
            } catch (e) {
                console.log(e);
            }
            config = Object.assign({}, defaultConfig, _origin_config);
            staticHandler.setConfig(config.static);
        }
    });
};