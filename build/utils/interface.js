"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os = require("os");
function getAllIps() {
    var res = [];
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
        ifaces[dev]
            .forEach(function (details, alias) {
            if (details.family == 'IPv4') {
                res.push(details.address);
            }
        });
    }
    ;
    return res;
}
exports.getAllIps = getAllIps;
function getBeautyStrOfIp(port, proxy) {
    if (proxy === void 0) { proxy = 'http'; }
    var me = this;
    var str = '';
    me
        .getAllIps()
        .forEach(function (ip, index) {
        str += "\n" + proxy + "://" + ip + ":" + port;
    });
    return str;
}
exports.getBeautyStrOfIp = getBeautyStrOfIp;
