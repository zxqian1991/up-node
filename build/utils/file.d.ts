/// <reference types="node" />
import * as fs from "fs";
export declare function exists(filename: string): Promise<fs.Stats>;
export declare function existsSync(filename: string): fs.Stats;
export declare function fileExists(filename: string): Promise<{}>;
export declare function fileExistsSync(filename: string): boolean;
export declare function directoryExists(filename: string): Promise<{}>;
export declare function directoryExistsSync(filename: string): boolean;
