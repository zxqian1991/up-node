"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
function getFullPath(url, pre) {
    if (url === void 0) { url = ""; }
    if (pre === void 0) { pre = process.cwd(); }
    return path.isAbsolute(url)
        ? url
        : path.join(pre, url);
}
exports.getFullPath = getFullPath;
