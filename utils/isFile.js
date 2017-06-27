// 判断是否是个文件
const fs = require("fs");
const path = require("path");
const getFullPath = require("./getFullPath");
module.exports = async function(filepath) {
    let fullpath = getFullPath(filepath);
    let res = false;
    try {
        await new Promise((resolve, reject) => {
            fs.stat(fullpath, function(err, status) {
                if (err) {
                    reject();
                } else {
                    resolve(status.isFile());
                }
            })
        });
        return true;
    } catch (e) {
        return res;
    };
};
module.exports.sync = function(filepath) {
    let fullpath = getFullPath(filepath);
    let res = false;
    try {
        let status = fs.statSync(fullpath);
        return status.isFile();
    } catch (e) {
        return res;
    };
}