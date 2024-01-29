const wordEle = document.querySelector('.main .word');
const mainTrasEle = document.querySelector('.main .main-tra');
const trasEle = document.querySelector('.main .tras');


class Word {
    #typings: Array<BaseTypeBlock> = [];
    #index: number = 0;
    #releaseElems: Array<Element> = [];
    #enAudio: SafeHTMLAudioElement;
    #zhAudio: SafeHTMLAudioElement;
    public constructor(info) {
        // 将单词推向打字区
        this.#typings.push(new WordTypeBlock(wordEle, info.word));
        // 将第一个汉译添加
        this.#createElement('div', mainTrasEle,
            { className: 'main-zh', textContent: info.mainTra.type + ' ' + info.mainTra.zh });
        // 将拼音推送到打字区
        info.mainTra.py.forEach(p => {
            if (isAllSign(p)) {
                this.#typings.push(new SignTypeBloc(this.#createElement('span', mainTrasEle, { className: 'py' }), p));
            } else {
                this.#typings.push(new WordTypeBlock(this.#createElement('span', mainTrasEle, { className: 'py' }), p));
            }
        })
        // 创建其他翻译
        for (let { type, tras } of info.tras) {
            this.#createElement('div', trasEle, { textContent: type + ' ' + tras.join('; ') });
        }
        // 下载语音
        this.#enAudio = enAudioGeter.getAudio(info.word);
        this.#zhAudio = zhAudioGeter.getAudio(info.mainTra.zh);
    }

    #createElement(type, patent = undefined, atts = null) {
        let buf = createElement(type, patent, atts);
        this.#releaseElems.push(buf);
        return buf;
    }

    public next(key) {
        let block = this.#typings[this.#index];
        if (block.next(key))
            if (this.#index++ === 0) {
                this.#enAudio.safePlay();
                this.#enAudio.onended = () => this.#zhAudio.safePlay();
            }
        block = this.#typings[this.#index];
        if (block instanceof WordTypeBlock) block.init();

        return this.#index >= this.#typings.length;
    }

    public release() {
        this.#typings.forEach(t => t.release());
        this.#releaseElems.forEach(e => e.remove());
    }
}