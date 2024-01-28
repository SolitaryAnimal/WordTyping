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

function isWord(target: string) {
    for (let index = 0; index < target.length; index++) {
        let v = target.charCodeAt(index);
        if (v < 87 || 122 < v) return false;
    }
    return true;
}