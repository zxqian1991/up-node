const Nuxt = require("nuxt");

module.exports = function(nuxt) {
    return async function(ctx, next) {
        ctx.status = 200 // koa defaults to 404 when it sees that status is unset
        await nuxt.render(ctx.req, ctx.res)
    };
}
module.exports.initNuxt = async function(config) {
    const nuxt = await new Nuxt(config);
    if (config.dev) {
        try {
            await nuxt.build()
        } catch (e) {
            console.error(e) // eslint-disable-line no-console
            process.exit(1)
        }
    };
    return nuxt;
};