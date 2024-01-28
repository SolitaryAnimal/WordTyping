// 打字区, 一组需要输入的连续字符
class TypeArea {
    private length: number;
    private index: number;
    private wordList: Array<Element> = [];
    private parent: Element;


    constructor(parent: Element, word: string) {
        this.parent = parent;
        this.length = word.length;
        this.index = 0;
        this.wordList = [];

        for (let i of word) {
            this.wordList.push(createElement('span', this.parent, { textContent: i }));
        }
    }


    next(key: string): boolean {
        if (key === this.wordList[this.index]?.textContent?.toLowerCase() ?? false) {
            // TODO: 需要跳过非字母的部分
            this.wordList[this.index++].className = 'pass';
        } else {
            // 输入错误的话就从头开始
            for (; this.index >= 0; this.index--) {
                this.wordList[this.index].removeAttribute('class');
            }
            this.index = 0;
        }
        // 如果输入完毕将生成下一个单词
        return this.index >= this.length;
    }

    release() {
        this.wordList.forEach(w => w.remove());
    }
}