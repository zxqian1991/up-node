const staticHandler = require("./static.handler");
const defaultConfig = require("./default.config");
const routerHandler = require("./router.handler");
const rx = require("rxjs");
const fs = require("fs");
const path = require("path");
module.exports = function(app, configpath) {
    let _origin_config;
    try {
        _origin_config = require(configpath)
    } catch (e) {
        console.log(e);
    }
    config = Object.assign({}, defaultConfig, _origin_config);
    // 静态目录的管理
    app.use(staticHandler(config.static));
    // 路由目录的处理
    app.use(routerHandler(config.routers));
    // 
    app.listen(config.port);
    let subject = new rx.BehaviorSubject();
    try {
        fs.watch(configpath, function(type, filename) {
            try {
                configpath = path.join(path.dirname(configpath), filename);
                // console.log(type, configpath);
                subject.next({
                    type,
                    filename
                })

            } catch (e) {
                console.log(e);
            }
        });
    } catch (e) {
        console.log(`监听文件${configpath}出错`, e)
    }
    // 等待三秒
    subject.debounceTime(2000)
        .distinctUntilChanged()
        .subscribe((value) => {
            if (value) {
                if (value.filename != path.basename(configpath)) {
                    configpath = path.join(path.dirname(configpath), value.filename);
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
        })
};