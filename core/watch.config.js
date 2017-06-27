const fs = require("fs");
const rxjs = require("rxjs");
const path = require("path");
// 监听文件的事件
module.exports = function(configpath) {
    let subject = new rxjs.BehaviorSubject();
    try {
        fs.watch(configpath, function(type, filename) {
            try {
                configpath = path.join(path.dirname(configpath), filename);
                // console.log(type, configpath);
                subject.next({
                    type,
                    filename,
                    configpath
                })

            } catch (e) {
                console.log(e);
            }
        });
    } catch (e) {
        console.log(`监听文件${configpath}出错`, e)
    }
    return subject.debounceTime(2000)
        .distinctUntilChanged()
}