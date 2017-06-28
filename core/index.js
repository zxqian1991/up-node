const staticHandler = require("./static.handler");
const defaultConfig = require("./default.config");
const routerHandler = require("./router.handler");
const rx = require("rxjs");
const fs = require("fs");
const path = require("path");
const watchConfig = require("./watch.config");
const colors = require("colors");
const statusHandler = require("./status.handler");
const nuxtHandler = require("./nuxt.handler");
module.exports = async function(app, configpath) {
    let _origin_config;
    try {
        _origin_config = require(configpath)
    } catch (e) {
        console.log(e);
    }
    config = Object.assign({}, defaultConfig, _origin_config);
    process.env.PORT = config.port;
    // 初始化nuxt
    app.use(statusHandler);
    // // 静态目录的管理
    app.use(staticHandler(config.static));
    // // 路由目录的处理
    // app.use(routerHandler(config.routers));;
    app.use(nuxtHandler(await nuxtHandler.initNuxt(require(path.join(__dirname, "../nuxt.config.js")))));
    app.listen(config.port);
    console.log("Server is Running at".white, `http://127.0.0.1:${config.port}`.blue);
    // 监听文件
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