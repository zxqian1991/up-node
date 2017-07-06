import * as os from 'os';
export function getAllIps() : Array < string > {
    let res: string[] = [];
    let ifaces = os.networkInterfaces();
    for (let dev in ifaces) {
        ifaces[dev]
            .forEach(function (details: os.NetworkInterfaceInfo, alias:number) {
                if (details.family == 'IPv4') {
                    res.push(details.address);
                }
            })
    };
    return res;
}
export function getBeautyStrOfIp(port : number, proxy : string = 'http') : string {
    let me = this;
    let str = '';
    me
        .getAllIps()
        .forEach((ip : string, index : number) => {
            str += `\n${proxy}://${ip}:${port}`
        });
    return str;
}