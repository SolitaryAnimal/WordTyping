abstract class BaseTypeBlock {
    protected eleArray: Array<Element> = [];
    #parent: Element;


    public constructor(parent: Element) {
        this.#parent = createElement('div', parent, { className: "type-block" });
    }


    public abstract next(key: string): boolean;


    public release() {
        this.#parent.remove();
    }


    protected createElement(text: string): Element {
        let buf = createElement('span', this.#parent, { textContent: text });
        this.eleArray.push(buf);
        return buf;
    }
}


// 单词打字区, 一组需要输入的连续字符
class WordTypeBlock extends BaseTypeBlock {
    #index: number = 0;
    #wordList: Array<Element> = [];


    constructor(parent: Element, word: string) {
        super(parent);
        for (let i of word) {
            var buf = this.createElement(i);
            if (isCM(i)) this.#wordList.push(buf);
        }
    }


    // 初始化最开始的符号元素效果
    public init() {
        for (const iterator of this.eleArray) {
            if (iterator === this.#wordList[0]) return;
            iterator.className = 'pass';
        }
    }


    public next(key: string): boolean {
        if (key === this.#wordList[this.#index]?.textContent?.toLowerCase() ?? false) {
            // 跳过非字母的部分
            do {
                this.#wordList[this.#index++].className = 'pass';
            }
            while (this.#index < this.#wordList.length && !isAllWord(this.#wordList[this.#index].textContent));
        } else {
            // 输入错误的话就从头开始
            for (; this.#index >= 0; this.#index--) {
                this.#wordList[this.#index].removeAttribute('class');
            }
            this.#index = 0;
        }
        // 如果输入完毕将生成下一个单词
        return this.#index >= this.#wordList.length;
    }
}

// 符号打字区, 不需要输入
class SignTypeBloc extends BaseTypeBlock {
    #textBlock: Element;
    constructor(parent: Element, word: string) {
        super(parent);
        this.#textBlock = this.createElement(word);
    }


    public next(key: string): boolean {
        this.#textBlock.className = 'pass';
        return true;
    }
}