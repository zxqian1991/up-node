/**
 * 服务端的入口文件，控制后台服务器
 */
const Koa = require('koa');
const app = new Koa();
const core = require("./core");
const path = require("path");
core(app, path.join(__dirname, "./app.config.js"));