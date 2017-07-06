"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("colors");
function exchange(res, i, j) {
    var tmp = res[i];
    res[i] = res[j];
    res[j] = tmp;
}
exports.exchange = exchange;
function order(arr, ifasyn, ifnew, getValue) {
    if (ifasyn === void 0) { ifasyn = true; }
    if (ifnew === void 0) { ifnew = false; }
    return merge(arr, ifasyn, ifnew, getValue);
}
exports.order = order;
function orderByKey(arr, key, ifasync, ifnew) {
    return order(arr, ifasync, ifnew, function (value) {
        return value[key];
    });
}
exports.orderByKey = orderByKey;
// 快速排序  从右向左
function quickPro(arr, ifasync, ifUseNew, getValue, begin, end) {
    if (ifasync === void 0) { ifasync = true; }
    if (ifUseNew === void 0) { ifUseNew = false; }
    if (begin === void 0) { begin = 0; }
    if (end === void 0) { end = arr.length - 1; }
    var res = ifUseNew
        ? arr.slice() : arr;
    getValue = getValue || function (value) {
        return value;
    };
    if (begin >= end || end < 0) {
        return res;
    }
    ;
    // function log(index:number,left:number,right:number){
    //     let str = '';
    //     console.log(begin,end,index,left,right);
    //     res.forEach((value:number | string,i:number)=>{
    //         value += "";
    //         let _str = i == index 
    //         ? (value as string).green 
    //         : (i == left ? (value as string).bgBlue :(i == right ? (value as string).bgRed : value) );
    //         if(left == right && i == left) {
    //             _str = (_str as string).cyan;
    //         }
    //         str += _str + " ";
    //     });
    //     console.log(str);
    // }
    function sort() {
        var value = getValue(res[begin]);
        var index = begin;
        var left = begin + 1;
        var right = end;
        // log(index,left,right);
        while (right > index) {
            if (getValue(res[right]) < value) {
                res[index] = res[right];
                index = right;
                right--;
                // log(index,left,right);
                while (left < index) {
                    if (getValue(res[left]) > value) {
                        res[index] = res[left];
                        index = left;
                        left++;
                        // log(index,left,right);
                        break;
                    }
                    else {
                        left++;
                        // log(index,left,right);
                    }
                }
            }
            else {
                right--;
                // log(index,left,right);
            }
        }
        ;
        res[index] = value;
        // log(index,left,right);
        // console.log(res);
        return index;
    }
    ;
    var index = sort();
    quickPro(arr, ifasync, false, getValue, begin, index - 1);
    quickPro(arr, ifasync, false, getValue, index + 1, end);
    return res;
}
exports.quickPro = quickPro;
// 快速排序 从左向右
function quick(arr, ifasync, ifUseNew, getValue, begin, end) {
    if (ifasync === void 0) { ifasync = true; }
    if (ifUseNew === void 0) { ifUseNew = false; }
    if (begin === void 0) { begin = 0; }
    if (end === void 0) { end = arr.length - 1; }
    var res = ifUseNew
        ? arr.slice() : arr;
    getValue = getValue || function (value) {
        return value;
    };
    // 根据键值排序
    function sort() {
        // 找到中间点
        if (begin > end || end < 0)
            return -1;
        var index = begin;
        var value = getValue(res[index]);
        var left = begin + 1;
        var right = end;
        if (left == right) {
            if (ifasync
                ? getValue(res[left]) < value
                : getValue(res[left]) > value) {
                res[left - 1] = res[left];
                index = left;
            }
        }
        while (left < right || (left == right && right == end)) {
            if (ifasync
                ? getValue(res[left]) < value
                : getValue(res[left]) > value) {
                res[left - 1] = res[left];
                index = left;
            }
            else {
                while ((ifasync
                    ? getValue(res[right]) > value
                    : getValue(res[right]) < value) && right > left) {
                    right--;
                }
                if (right > left) {
                    exchange(res, left, right);
                    res[left - 1] = res[left];
                    index = left;
                }
                ;
            }
            left++;
        }
        ;
        res[index] = value;
        return index;
    }
    ;
    var index = sort();
    if (index >= 0) {
        quick(res, ifasync, false, getValue, begin, index - 1);
        quick(res, ifasync, false, getValue, index + 1, end);
    }
    return res;
}
exports.quick = quick;
// 堆排序
function heap(arr, ifasync, ifUseNew, getValue) {
    if (ifasync === void 0) { ifasync = true; }
    if (ifUseNew === void 0) { ifUseNew = false; }
    var res = ifUseNew
        ? arr.slice() : arr;
    getValue = getValue || function (value) {
        return value;
    };
    var count = 0;
    // 自动调整二叉树，保证最上面的是最大的
    function just(index) {
        var left = index * 2 + 1;
        var right = index * 2 + 2;
        if (left < res.length - count) {
            // 说明没到底
            var maxindex = right < res.length - count
                ? (getValue(res[right]) > getValue(res[left])
                    ? (ifasync
                        ? right
                        : left)
                    : (ifasync
                        ? left
                        : right))
                : (left);
            if (ifasync
                ? getValue(res[maxindex]) > getValue(res[index])
                : getValue(res[maxindex]) < getValue(res[index])) {
                exchange(res, index, maxindex);
                just(maxindex);
            }
            ;
        }
    }
    ;
    // 初始化
    for (var i = Math.floor((res.length - 1) / 2); i >= 0; i--) {
        just(i);
    }
    ;
    // 交换
    exchange(res, 0, res.length - 1);
    count++;
    var times = res.length - count;
    for (var i = 0; i < times; i++) {
        just(0);
        exchange(res, 0, res.length - count - 1);
        count++;
    }
    ;
    return res;
}
exports.heap = heap;
// 归并排序  由于需要用到临时数组
function merge(arr, ifasync, ifUseNew, getValue, begin, end, ifFirst) {
    if (ifasync === void 0) { ifasync = true; }
    if (ifUseNew === void 0) { ifUseNew = false; }
    if (begin === void 0) { begin = 0; }
    if (end === void 0) { end = arr.length - 1; }
    if (ifFirst === void 0) { ifFirst = true; }
    var me = this;
    getValue = getValue || function (value) {
        return value;
    };
    if (begin != end) {
        var middle = Math.floor((begin + end) / 2);
        var left = merge(arr, ifasync, ifUseNew, getValue, begin, middle, false);
        var right = merge(arr, ifasync, ifUseNew, getValue, middle + 1, end, false);
        var tp = !(!ifUseNew && ifFirst)
            ? []
            : arr;
        var j = 0;
        var index = begin;
        var i_begin = !(!ifUseNew && ifFirst)
            ? 0
            : begin;
        var i_end = (!(!ifUseNew && ifFirst)
            ? left.length - 1
            : middle);
        for (var i = i_begin; i <= i_end; i++) {
            while (j < right.length && (ifasync
                ? getValue(right[j]) < getValue(left[i])
                : getValue(right[j]) < getValue(left[i]))) {
                if (!(!ifUseNew && ifFirst)) {
                    tp.push(right[j]);
                }
                else {
                    tp[index] = right[j];
                    index++;
                }
                j++;
            }
            ;
            if (!(!ifUseNew && ifFirst)) {
                tp.push(left[i]);
            }
            else {
                tp[index] = left[i];
                index++;
            }
        }
        ;
        var j_end = right.length - 1;
        for (var i = j; i <= j_end; i++) {
            if (!(!ifUseNew && ifFirst)) {
                tp.push(right[i]);
            }
            else {
                tp[index] = right[i];
                index++;
            }
        }
        return tp;
    }
    else {
        return ifUseNew && ifFirst
            ? arr
            : [arr[begin]];
    }
}
exports.merge = merge;
// 冒泡排序，，默认改变原数组，所以额外有个ifUseNew选项，
function bubble(arr, ifUseNew, getValue, ifasync) {
    if (ifUseNew === void 0) { ifUseNew = false; }
    if (ifasync === void 0) { ifasync = true; }
    var res = ifUseNew
        ? []
        : arr;
    getValue = getValue || function (value) {
        return value;
    };
    if (arr && arr.length > 0) {
        for (var i = 0; i < arr.length - 1; i++) {
            for (var j = i + 1; j < arr.length; j++) {
                if (i == 0 && ifUseNew) {
                    if (j == 1) {
                        res.push(arr[i]);
                    }
                    res.push(arr[j]);
                }
                var value_j = getValue(res[j]);
                var value_i = getValue(res[i]);
                if (ifasync
                    ? value_j < value_i
                    : value_j > value_i) {
                    var _tp = res[i];
                    res[i] = res[j];
                    res[j] = _tp;
                }
            }
        }
        ;
    }
    ;
    return res;
}
exports.bubble = bubble;
