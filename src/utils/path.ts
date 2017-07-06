import * as path from "path";
export function getFullPath(url : string = "", pre : string = process.cwd()) {
    return path.isAbsolute(url)
        ? url
        : path.join(pre, url);
}