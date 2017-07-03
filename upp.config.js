const path = require("path");
module.exports = {
    port: 11342,
    logger: {
        root: path.join(__dirname, "logs"),
        loggers: {
            "qianzhixiang": {
                filename: "qianzhixiang.log"
            }
        }
    }
};