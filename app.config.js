const path = require("path");
module.exports = {
    port: 80,
    // 静态文件所在的目录 这是一个数组，会根据这个路径去寻找
    static: {
        // 静态文件所在的目录映射 如果是绝对路径，则从绝对路径进入
        pre: "",
        root: {
            // 公共的路径 最先访问
            "$public": [
                // web在的目录

            ],
            // ip地址访问时的路径
            "$ip": [

            ],
            // 符合这个域名正则的
            "*.loveqzx.com": []
        },
        // 静态文件的映射 根据映射去查找对应的路径 mappinp的优先级最高
        mapping: {
            "$public": {
                "index.js$": path.join(__dirname, "./utils/exists.js")
            },
            "$ip": {

            }
        }
    },
    // 根据请求路径的路由处理  这里是处理文件而不是单独的发送文本  是需要执行的部分
    routers: {
        root: [
            path.join(__dirname, "routers")
        ],
        // 对路径的特殊的处理
        mapping: {
            "$public": {
                "mk$": "./routers/index.js"
            }
        },
        pre: "./"
    }
};