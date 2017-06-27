const getFullPath = require("./getFullPath");
const fs = require("fs");
module.exports = async function(filepath) {
    try {
        let fullpath = getFullPath(filepath);
        return await new Promise((resolve, reject) => {
            fs.stat(fullpath, function(err, stat) {
                if (!err) {
                    resolve(stat);
                } else {
                    reject();
                }
            })
        })
    } catch (e) {
        return null;
    }
};
module.exports.sync = function(filepath) {
    try {
        let fullpath = getFullPath(filepath);
        let stat = fs.statSync(fullpath);
        return stat;
    } catch (e) {
        return null;
    }
}