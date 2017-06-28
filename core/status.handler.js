const getStatusColor = require("./getStatusColor");
const colors = require("colors");
module.exports = async function(ctx, next) {
    let begin = new Date();
    await next();
    let end = new Date();
    let status = (ctx.status + "")[getStatusColor(ctx.status)]
    console.log(`[${begin.toLocaleString()}]`.yellow.underline, `${ctx.host} `.cyan, `${ctx.request.method} `.green, `${ctx.url}`.yellow, status, `${end.getTime() - begin.getTime()}ms`.bgBlue);
};