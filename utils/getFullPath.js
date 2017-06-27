const path = require("path");
module.exports = function(filepath, pre) {
    pre = pre || path.resolve();
    return path.isAbsolute(filepath) ? filepath : path.join(pre, filepath);
};