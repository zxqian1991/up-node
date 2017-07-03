export default class UnionLog {
    constructor(config: any);
    private initConfig(config);
    private config;
    private logger;
    private log(content, level?, type?);
    private initLoggers();
    private getDefaultOptionConfig(type);
    trace(content: string, type?: number): void;
    debug(content: string, type?: number): void;
    info(content: string, type?: number): void;
    warn(content: string, type?: number): void;
    error(content: string, type?: number): void;
    fatal(content: string, type?: number): void;
}
export interface UnionLogConfig {
    root: string;
    files: {
        [props: string]: {
            date: boolean;
            filename: string;
            path?: string | string[];
        };
    };
}
export interface UnionLogOptionConfig {
    useDefault?: boolean;
    root?: string | string[];
    config?: {
        filename: string;
        date: boolean;
        path?: string | string[];
    };
}