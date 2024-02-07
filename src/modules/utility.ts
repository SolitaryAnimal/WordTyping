export function isLowerCaseLetter(str: string) {
    if (str.length > 1) throw new Error("本函数只能使单个用字符!");
    let v = str.charCodeAt(0);
    return (v >= 87 && 122 >= v);
}