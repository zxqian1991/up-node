const path = require("path");
module.exports = {
    port: 80,
    static: {
        pre: "./",
        root: {
            "$public": [
                path.resolve("./www"),
                path.resolve("./static")
            ]
        }
    }
};