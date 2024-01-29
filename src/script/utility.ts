// 创建元素的快捷方式
function createElement(type: string, patent: Element | null = null, atts: object | null = null) {
    let buf = document.createElement(type);
    if (patent) patent.appendChild(buf);
    if (!atts) return buf;
    for (let att in atts) {
        buf[att] = atts[att];
    }
    return buf;
}


// 字符是否是小写字母
function isCM(target: string) {
    if (target.length > 1) throw new Error("本函数只能使用字符!");
    let v = target.charCodeAt(0);
    return (v >= 87 && 122 >= v);
}


// 字符串是否全由小写字母组成
function isAllWord(target: string) {
    for (let index = 0; index < target.length; index++) {
        let v = target.charCodeAt(index);
        if (v < 87 || 122 < v) return false;
    }
    return true;
}


function isAllSign(target: string) {
    for (let index = 0; index < target.length; index++) {
        let v = target.charCodeAt(index);
        if (v >= 87 && 122 >= v) return false;
    }
    return true;
}