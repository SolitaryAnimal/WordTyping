export function isLowerCaseLetter(str: string) {
    if (str.length > 1) throw new Error("本函数只能使单个用字符!");
    let v = str.charCodeAt(0);
    return (v >= 87 && 122 >= v);
}

export function animation(targetTime: number, draw: (time: number) => void) {
    let start = performance.now();
    requestAnimationFrame(function animationLoop(time) {
        let normalTime = (time - start) / targetTime;
        if (normalTime >= 1) {
            normalTime = 1;
        } else {
            requestAnimationFrame(animationLoop);
        }
        if (normalTime < 0) normalTime = 0;
        draw(normalTime);
    })
}