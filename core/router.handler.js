module.exports = function(config) {
    return async function(ctx, next) {
        next();
    };
};