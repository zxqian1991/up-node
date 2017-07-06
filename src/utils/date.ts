export function getLocalDateString(date : Date = new Date()) {
    let str = date.toLocaleString();
    return str;
}