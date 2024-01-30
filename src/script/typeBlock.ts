abstract class BaseTypeBlock {
    protected eleArray: Array<Element> = [];
    protected parent: HTMLElement;


    public constructor(parent: Element) {
        this.parent = createElement('div', parent, { className: "type-block" });
        this.parent.style.position = 'relative';
    }


    public abstract next(key: string): boolean;


    public release() {
        this.parent.remove();
    }


    protected createElement(text: string): HTMLElement {
        let buf = createElement('span', this.parent, { textContent: text });
        this.eleArray.push(buf);
        return buf;
    }
}


// 单词打字区, 一组需要输入的连续字符
class WordTypeBlock extends BaseTypeBlock {
    #index: number = 0;
    #wordList: Array<HTMLElement> = [];
    #pase: boolean = false;


    constructor(parent: HTMLElement, word: string) {
        super(parent);
        for (let i of word) {
            var buf = this.createElement(i);
            if (isCM(i)) this.#wordList.push(buf);
        }
    }


    #playErrorAnimation(errorKey: HTMLElement) {
        let start = performance.now();
        let frequency = 20;
        let distance = 10;
        let animationTime = 300;
        let parent = this.parent;
        let area = this;

        requestAnimationFrame(function anime(time) {
            let timeFraction = (time - start) / animationTime;
            if (timeFraction > 1) {
                timeFraction = 1;
                errorKey.style.removeProperty('color');
            }
            else {
                let c = timeFraction * 255;
                errorKey.style.color = `rgb(255, ${c}, ${c})`;
                requestAnimationFrame(anime);
            }
            if (area.#pase && timeFraction > 0.8) area.#pase = false;
            parent.style.left = Math.sin(timeFraction * frequency) * distance * (1 - timeFraction) + 'px';
        })
    }


    // 初始化最开始的符号元素效果
    public init() {
        for (const iterator of this.eleArray) {
            if (iterator === this.#wordList[0]) return;
            iterator.className = 'pass';
        }
    }


    public next(key: string): boolean {
        if (this.#pase) return false;
        if (key === this.#wordList[this.#index]?.textContent?.toLowerCase() ?? false) {
            // 跳过非字母的部分
            do {
                this.#wordList[this.#index++].className = 'pass';
            }
            while (this.#index < this.#wordList.length && !isAllWord(this.#wordList[this.#index].textContent));
        } else {
            // 播放错误动画
            this.#playErrorAnimation(this.#wordList[this.#index]);
            // 输入错误的话就从头开始
            for (; this.#index >= 0; this.#index--) {
                this.#wordList[this.#index].removeAttribute('class');
            }
            this.#index = 0;
            // 暂时暂停输入
            this.#pase = true;
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