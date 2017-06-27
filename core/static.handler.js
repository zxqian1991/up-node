const path = require("path");
const getFullPath = require("../utils/getFullPath");
const fs = require("fs");
const exists = require("../utils/exists");
const mime = require('mime');
/**
 * 静态文件处理器
 */
function staticHandler(config) {
    // config 包括  mapping 和 root
    let me = this;
    staticHandler.config = config;
    return async function(ctx, next) {
        try {
            let pre = getFullPath(staticHandler.config.pre);
            // 先看看映射是否有对应的映射
            let lastfilepath;
            // 如果mapping 存在 那么获取最终的路径
            if (staticHandler.config.mapping) {
                lastfilepath = await staticHandler.analyseMapping(ctx, staticHandler.config.mapping, pre);
            };
            // 如果没有 其次看对应的静态文件目录下是否有
            if (!lastfilepath && staticHandler.config.root) {
                lastfilepath = await staticHandler.analyseMapping(ctx, staticHandler.config.root, pre)
            }
            // console.log(lastfilepath);
            if (lastfilepath) {
                staticHandler.sendFile(ctx, lastfilepath);
            }

        } catch (e) {
            next();
        }
    };
};
staticHandler.analyseMapping = async function(ctx, mapping, pre) {
    mapping = mapping || {};
    pre = pre || getFullPath("");
    let host = staticHandler.analyseHost(ctx.host, ctx.protocol);
    // 遍历mapping key值是ip
    if (/^(\d)+(\.\d+)+/gi.test(host.hostname) && mapping.hasOwnProperty("$ip")) {
        let lastPath = await staticHandler.getMappingPath(ctx, mapping["$ip"], pre);
        if (lastPath) {
            return lastPath;
        }
    } else {
        for (host in mapping) {
            if (!/^\$/gi.test(host)) {
                // 不是公共的 以$开头的 那么遍历一遍看有没有满足的
                let lastPath = await staticHandler.getMappingPath(ctx, mapping[host], pre);
                if (lastPath) {
                    return lastPath;
                }
            }
        }
    }
    // 到这步还没有找到，那说明可能需要使用public
    if (mapping.hasOwnProperty("$public")) {
        let lastPath = await staticHandler.getMappingPath(ctx, mapping["$public"], pre);
        debugger;
        if (lastPath) {
            return lastPath;
        };
    }
    return null;
};
// 根据映射获取路径
staticHandler.getMappingPath = async function(ctx, obj, pre) {
    pre = pre || getFullPath("");
    let type = typeof obj;
    if (type == "object") {
        let isArray = obj instanceof Array;
        for (let url in obj) {
            let matches;
            if (!isArray) {

                try {
                    let reg = new RegExp(url, "gi");
                    matches = ctx.url.match(reg);
                } catch (e) {
                    console.log("Regexp error", e)
                }
            }
            if (isArray || (matches && matches.length > 0)) {
                // 获得绝对路径
                try {
                    let realPath = await staticHandler.getUrlRealPath(obj[url], pre);
                    if (realPath) {
                        return realPath;
                    }
                } catch (e) {
                    console.log(`error in ${__filename}:`, e, `the ctx is `, ctx, `the obj is`, obj);
                }

            }
        };
    }
    return null;
}
staticHandler.analyseHost = function(host, protocol) {
    // 根据host分析主机
    protocol = protocol || "http";
    let hostinfo = host.split(":");
    return {
        hostname: hostinfo[0],
        port: hostinfo[1] || (protocol == "http" ? 80 : 443)
    }
};
/**
 * 对配置进行遍历 根据 host  /  url 去进行模糊匹配
 */
staticHandler.getUrlRealPath = async function(fullpath, pre) {
    let type = typeof fullpath;
    pre = pre || getFullPath('');
    if (type == "object") {
        if (fullpath instanceof Array) {
            // 是数组
            for (let i in fullpath) {
                let result_path = await getUrlRealPath(fullpath[i], pre);
                if (result_path) {
                    return result_path;
                }
            }
        } else {
            // 是对象
            let root = getFullPath(fullpath.root || '', pre);
            fullpath = getFullPath(fullpath.value || '', root);
        }
    } else {
        fullpath = getFullPath(fullpath, pre);
    }
    let status = await exists(fullpath);
    if (status) {
        if (status.isDirectory()) {
            // 是文件夹
            let _html_path = getFullPath("index.html", fullpath);
            let _exists_html = await exists(_html_path);
            if (_exists_html && _exists_html.isFile()) {
                // 存在
                return _html_path;
            }
        } else if (status.isFile()) {
            return fullpath;
        }
    }
    return null;
}
staticHandler.sendFile = function(ctx, realpath) {
    let type = mime.lookup(realpath);
    const content = fs.readFileSync(realpath, 'binary');
    ctx.type = type;
    ctx.res.writeHead(200);
    ctx.res.write(content, 'binary');
    ctx.res.end();
};
staticHandler.setConfig = function(config) {
    staticHandler.config = config;
}
module.exports = staticHandler;