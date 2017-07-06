import * as path from "path";
import * as fs from "fs";
export function exists (filename : string) : Promise < fs.Stats > {
    return new Promise((resolve, reject) => {
        try {
            filename = path.isAbsolute(filename)
                ? filename
                : path.join(process.cwd(), filename);
            fs.stat(filename, function (err, stat) {
                resolve(err
                    ? null
                    : stat);
            })

        } catch (e) {
            console.log(e);
            resolve(null);
        }
    })
}
export function existsSync (filename : string) : fs.Stats {
    filename = path.isAbsolute(filename)
        ? filename
        : path.join(process.cwd(), filename);
    try {
        let stat : fs.Stats = fs.statSync(filename);
        return stat;
    } catch (e) {
        console.log(e);
        return null;
    }
}
export function fileExists (filename : string) {
    let me = this;
    return new Promise((resolve, reject) => {
        me
            .exists(filename)
            .then((stat : fs.Stats) => {
                resolve(stat
                    ? stat.isFile()
                    : false);
            })
    })
}
export function fileExistsSync (filename : string) {
    let me = this;
    let stat : fs.Stats = me.existsSync(filename);
    return stat
        ? stat.isFile()
        : false;
}
export function directoryExists (filename : string) {
    let me = this;
    return new Promise((resolve, reject) => {
        me
            .exists(filename)
            .then((stat : fs.Stats) => {
                resolve(stat
                    ? stat.isDirectory()
                    : false);
            })
    })
}
export function directoryExistsSync (filename : string) {
    let me = this;
    let stat : fs.Stats = me.existsSync(filename);
    return stat
        ? stat.isDirectory()
        : false;
}
