export interface UnionAppConfig {
    port: number;
    logger?: string | {

    }
}
const defaultConfig: UnionAppConfig = {
    port: 8080
};
export default defaultConfig;