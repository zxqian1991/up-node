export function normal(obj1 : any, obj2 : any) {
    let type1 : string = typeof obj1;
    let type2 : string = typeof obj2;
    if (type1 == "object" && type2 == "object" && !(obj2 instanceof Array)) {
        for (let i in obj2) {
            obj1[i] = obj2[i];
        };
        return obj1;
    };
    return obj2;
}
// 深度复制  需要考虑循环引用
export function deep(obj1 : any, obj2 : any, obj2p : any[] = [obj2]) {
    let me = this;
    let type1 = typeof obj1;
    let type2 = typeof obj2;
    if (type1 == "object" && type2 == "object" && !(obj2 instanceof Array)) {
        for (let i in obj2) {
            if (!obj1.hasOwnProperty(i)) {
                obj1[i] = obj2[i];
            } else {
                if (obj2p.indexOf(obj2[i]) >= 0) {
                    // 存在循环引用
                    obj1[i] = obj2[i];
                } else {
                    // 不存在
                    obj1[i] = me.deep(obj1[i], obj2[i], [
                        ...obj2p,
                        obj2[i]
                    ]);
                }
            }
        }
        return obj1;
    };
    return obj2;
}