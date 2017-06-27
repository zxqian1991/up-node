const path = require("path");
const getFullPath = require("../utils/getFullPath");
const fs = require("fs");
const exists = require("../utils/exists");
const mime = require('mime');
const render = require("./render");
const colors = require('colors');
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
            if (lastfilepath) {
                if (lastfilepath.type == "directory") {
                    // 查看根目录下是否有index.html
                    let index = "index.html"
                    if (staticHandler.hasIndex(lastfilepath.path, index)) {
                        staticHandler.sendFile(ctx, getFullPath(index, lastfilepath.path));
                    } else {
                        // 不存在
                        render(ctx, getFullPath("../default/files.vue", __dirname), lastfilepath.path);
                    }
                } else if (lastfilepath.type == "file") {
                    staticHandler.sendFile(ctx, lastfilepath.path);
                }
                //staticHandler.sendFile(ctx, lastfilepath.path);
            } else {
                await next()
            }

        } catch (e) {
            await next()
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
            } else {
                // 是数组 
            }
            if (isArray || (matches && matches.length > 0)) {
                // 获得绝对路径
                try {
                    let realPath = await staticHandler.getUrlRealPath(obj[url], ctx.url, !isArray, pre);
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
staticHandler.getUrlRealPath = async function(fullpath, url, isMapping, pre) {
    let type = typeof fullpath;
    pre = pre || getFullPath('');
    if (type == "object") {
        if (fullpath instanceof Array) {
            // 是数组
            for (let i in fullpath) {
                let result_path = await getUrlRealPath(fullpath[i], url, isMapping, pre);
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
        fullpath = getFullPath(isMapping ? fullpath : path.join(fullpath, url), pre);
    }
    let status = await exists(fullpath);
    if (status) {
        return {
            path: fullpath,
            type: status.isDirectory() ? "directory" : (status.isFile() ? "file" : "other")
        }
    }
    return null;
}
staticHandler.hasIndex = async function(folder, index) {
    index = index || "index.html"
    let _html_path = getFullPath(index, folder);
    let _exists_html = await exists(_html_path);
    if (_exists_html && _exists_html.isFile()) {
        return true
    }
    return false;
}
staticHandler.sendFile = function(ctx, realpath) {
    let type = mime.lookup(realpath);
    try {
        const content = fs.readFileSync(realpath, 'binary');
        ctx.type = type;
        ctx.res.writeHead(200);
        ctx.res.write(content, 'binary');
        ctx.res.end();
    } catch (e) {
        console.log(e);
    }
};
staticHandler.setConfig = function(config) {
    staticHandler.config = config;
}
module.exports = staticHandler;