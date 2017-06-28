const getFullPath = require("../utils/getFullPath");
const exists = require("../utils/exists");

function routerHandler(config) {
    routerHandler.setConfig(config);
    return async function(ctx, next) {
        try {
            let pathInfo = await routerHandler.getPathInfo(ctx);
            if (pathInfo) {
                if (process.env.NODE_ENV != "production") {
                    delete require.cache[pathInfo.filepath];
                };
                let handler = require(pathInfo.filepath);
                await handler(ctx, next, pathInfo);
            } else {
                await next();
            }
        } catch (e) {
            console.log(e)
            await next();
        }
    };
};
routerHandler.setConfig = function(config) {
    routerHandler.config = config;
};
// 根据配置无获取路径信息
routerHandler.getPathInfo = async function(ctx) {
    // 首先获得前缀  指明目录在哪里
    let config = routerHandler.config;
    let pre = getFullPath(config.pre || '');
    let filepath;
    // 首先遍历映射
    if (config.mapping) {
        filepath = await routerHandler.walkMapping(ctx, config.mapping, pre);
        filepath = filepath ? {
            filepath: filepath,
            data: null
        } : null;
    };
    // 其次遍历根目录
    if (!filepath && config.root) {
        // 根目录指定的是目录
        filepath = await routerHandler.walkRoot(ctx, config.root, pre);
        // 这里由于是遍历目录不是映射，所以都是对象
    }
    // 根目录也没有 需要遍历 pre目录
    if (!filepath) {
        filepath = await routerHandler.walkRootHandler(ctx, pre);

    }
    if (filepath) {
        return filepath;
    };
    return null;
};
routerHandler.walkRoot = async function(ctx, mapping, pre) {
    for (let i in mapping) {
        let pathInfo = await routerHandler.walkRootHandler(ctx, getFullPath(mapping[i], pre));
        if (pathInfo) {
            return pathInfo;
        }
    };
};
routerHandler.walkRootHandler = async function(ctx, pre) {
    let urlpath = ctx.path;
    let urls = urlpath.split("/");
    // 移除第一个
    urls.shift();
    return await routerHandler.walkRootHandlerHelper(urls, pre);
    // 依次寻找
};
routerHandler.walkRootHandlerHelper = async function(urls, pre, values) {
    values = values || [];
    let value = urls.shift();
    values.push(value);
    let fpath = getFullPath(value, pre)
    let status = await exists(fpath);
    if (status) {
        if (status.isDirectory()) {
            return await routerHandler.walkRootHandlerHelper(urls, fpath, values);
        } else {
            // 说明有对应的文件
            return {
                filepath: fpath,
                data: urls,
                values: values
            }
        }
    } else {
        // 不存在，那么查看是不是有index.js
        fpath = getFullPath("index.js", pre);
        status = await exists(fpath);
        if (status && status.isFile()) {
            return {
                filepath: fpath,
                data: urls,
                values: values
            }
        }
    }
    return null;
};
routerHandler.walkMapping = async function(ctx, mapping, pre) {
    let type = routerHandler.getHostType(ctx.hostname);
    if (type == "$ip") {
        if (mapping.hasOwnProperty("$ip")) {
            // 查看以IP地址为主的下面是否有
            let filepath = await routerHandler.walkMappingHandler(ctx, mapping["$ip"], pre);
            if (filepath) {
                return filepath;
            }
        }
    } else {
        // 接下来需要去遍历域名，以找到是否有对应的映射
        for (let key in mapping) {
            // 不是以$开头的
            if (!/^\$/gi.test(key)) {
                let filepath = await routerHandler.walkMappingHandler(ctx, mapping[key], pre);
                if (filepath) {
                    return filepath;
                }
            }
        }
    }
    // 都遍历好了,还没找到，这个时候需要遍历$public
    if (mapping.hasOwnProperty("$public")) {
        // 公共的属性
        let filepath = await routerHandler.walkMappingHandler(ctx, mapping["$public"], pre);
        if (filepath) {
            return filepath;
        }
    };
    // 所有的遍历完了，就返回空值
    return null;
};
// 根据不同
routerHandler.walkMappingHandler = async function(ctx, mapping, pre) {
    for (let url in mapping) {
        // 这里默认都是字符串
        let matches;
        try {
            let reg = new RegExp(url, "gi");
            matches = ctx.path.match(reg);
            if (matches && matches.length > 0) {
                // return mapping[url];
                let fullpath = getFullPath(mapping[url], pre);
                let stat = await exists(fullpath);
                if (stat) {
                    return fullpath;
                }
            }
        } catch (e) {
            console.log("Regexp error", e)
        }
    }
    return null;
};
// 判断
routerHandler.getHostType = function(hostname) {
    let me = this;
    return /^(\d)+(\.\d+)+/gi.test(hostname) ? "$ip" : "$domain";
};
module.exports = routerHandler;