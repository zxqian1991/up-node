"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getLocalDateString(date) {
    if (date === void 0) { date = new Date(); }
    var str = date.toLocaleString();
    return str;
}
exports.getLocalDateString = getLocalDateString;
