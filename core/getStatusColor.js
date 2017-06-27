module.exports = function(status) {
    if (status) {
        if (status >= 200 && status < 300) {
            return "green";
        }
        if (status >= 300 && status < 400) {
            return "magenta";
        }
        if (status >= 400 && status < 500) {
            return "red";
        }
        if (status >= 500) {
            return "bgRed";
        }
    }
}