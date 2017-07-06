"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
function exists(filename) {
    return new Promise(function (resolve, reject) {
        try {
            filename = path.isAbsolute(filename)
                ? filename
                : path.join(process.cwd(), filename);
            fs.stat(filename, function (err, stat) {
                resolve(err
                    ? null
                    : stat);
            });
        }
        catch (e) {
            console.log(e);
            resolve(null);
        }
    });
}
exports.exists = exists;
function existsSync(filename) {
    filename = path.isAbsolute(filename)
        ? filename
        : path.join(process.cwd(), filename);
    try {
        var stat = fs.statSync(filename);
        return stat;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}
exports.existsSync = existsSync;
function fileExists(filename) {
    var me = this;
    return new Promise(function (resolve, reject) {
        me
            .exists(filename)
            .then(function (stat) {
            resolve(stat
                ? stat.isFile()
                : false);
        });
    });
}
exports.fileExists = fileExists;
function fileExistsSync(filename) {
    var me = this;
    var stat = me.existsSync(filename);
    return stat
        ? stat.isFile()
        : false;
}
exports.fileExistsSync = fileExistsSync;
function directoryExists(filename) {
    var me = this;
    return new Promise(function (resolve, reject) {
        me
            .exists(filename)
            .then(function (stat) {
            resolve(stat
                ? stat.isDirectory()
                : false);
        });
    });
}
exports.directoryExists = directoryExists;
function directoryExistsSync(filename) {
    var me = this;
    var stat = me.existsSync(filename);
    return stat
        ? stat.isDirectory()
        : false;
}
exports.directoryExistsSync = directoryExistsSync;
