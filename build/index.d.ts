/// <reference types="koa" />
import * as Koa from "koa";
import UnionLog from "./logger";
import { UnionAppConfig } from './default.config';
export declare class UnionApp {
    constructor(config: UnionAppConfig | string);
    logger: UnionLog;
    app: Koa;
    config: UnionAppConfig;
    initConfig(config: any): Promise<void>;
    initApp(): Promise<void>;
}
