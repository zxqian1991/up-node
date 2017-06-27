const exists = require("../utils/exists");
const getFullPath = require("../utils/getFullPath");
const fullpath = getFullPath("../utils/isFile.jss", __dirname);
let res = exists.sync(fullpath);
console.log(res);
const isFile = require("../utils/isFile");
console.log(isFile.sync(fullpath));