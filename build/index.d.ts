/// <reference types="koa" />
import * as Koa from "koa";
import { UnionAppConfig } from './default.config';
export declare class UnionApp {
    constructor(config: UnionAppConfig);
    app: Koa;
    config: UnionAppConfig;
    initConfig(): Promise<void>;
}
