"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function normal(obj1, obj2) {
    var type1 = typeof obj1;
    var type2 = typeof obj2;
    if (type1 == "object" && type2 == "object" && !(obj2 instanceof Array)) {
        for (var i in obj2) {
            obj1[i] = obj2[i];
        }
        ;
        return obj1;
    }
    ;
    return obj2;
}
exports.normal = normal;
// 深度复制  需要考虑循环引用
function deep(obj1, obj2, obj2p) {
    if (obj2p === void 0) { obj2p = [obj2]; }
    var me = this;
    var type1 = typeof obj1;
    var type2 = typeof obj2;
    if (type1 == "object" && type2 == "object" && !(obj2 instanceof Array)) {
        for (var i in obj2) {
            if (!obj1.hasOwnProperty(i)) {
                obj1[i] = obj2[i];
            }
            else {
                if (obj2p.indexOf(obj2[i]) >= 0) {
                    // 存在循环引用
                    obj1[i] = obj2[i];
                }
                else {
                    // 不存在
                    obj1[i] = me.deep(obj1[i], obj2[i], obj2p.concat([
                        obj2[i]
                    ]));
                }
            }
        }
        return obj1;
    }
    ;
    return obj2;
}
exports.deep = deep;
