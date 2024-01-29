abstract class BaseTypeBlock {
    protected eleArray: Array<Element> = [];
    protected parent: Element;


    public constructor(parent: Element) {
        this.parent = createElement('div', parent, { className: "type-block" });
    }


    public abstract next(key: string): boolean;


    public release() {
        this.parent.remove();
    }


    protected createElement(text: string, parent: Element = this.parent): HTMLElement {
        return createElement('span', parent, { textContent: text });
    }
}


// 单词打字区, 一组需要输入的连续字符
class WordTypeBlock extends BaseTypeBlock {
    #index: number = 0;
    #wordList: Array<HTMLElement> = [];
    #passEle: HTMLElement;
    #orginMask: HTMLElement;
    #orginEle: HTMLElement;
    #width: number;


    constructor(parent: Element, word: string) {
        super(parent);
        this.#orginMask = createElement('div', this.parent, { className: "orginMask" });
        this.#orginEle = createElement('div', this.#orginMask, { className: "orgin" });
        this.#passEle = createElement('div', this.parent, { className: "pass", style: "width:0;" });
        for (let i of word) {
            var buf = this.createElement(i, this.#orginEle);
            if (isCM(i)) this.#wordList.push(buf);
            // 用于动画
            this.createElement(i, this.#passEle);
        }
        this.#width = this.#orginEle.offsetWidth;
        this.parent.setAttribute('style', `width: ${this.#width}px; height: ${this.#orginEle.offsetHeight}px`)
        this.#orginMask.setAttribute('style', `width: ${this.#width}px; height: ${this.#orginEle.offsetHeight}px`)
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
                this.#index++;
            }
            while (this.#index < this.#wordList.length && !isAllWord(this.#wordList[this.#index].textContent));

            // 更新显示颜色
            let ele = this.#wordList[this.#index - 1];
            this.#passEle.setAttribute('style', `width: ${ele.offsetLeft + ele.offsetWidth}px`);
            this.#orginMask.style.width = this.#width - ele.offsetLeft + 'px';
            this.#orginMask.style.left = ele.offsetLeft + 'px';
            this.#orginEle.style.left = -ele.offsetLeft + 'px';
        } else {
            // 输入错误的话就从头开始
            for (; this.#index >= 0; this.#index--) {
                this.#wordList[this.#index].removeAttribute('class');
            }
            this.#index = 0;
            this.#passEle.setAttribute('style', 'width: 0');
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