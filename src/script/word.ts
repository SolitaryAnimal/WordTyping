const wordEle = document.querySelector('.main .word');
const mainTrasEle = document.querySelector('.main .main-tra');
const trasEle = document.querySelector('.main .tras');


class Word {
    #typings: Array<TypeArea> = [];
    #index: number = 0;
    #releaseElems: Array<Element> = [];
    #enAudio: SafeHTMLAudioElement;
    #zhAudio: SafeHTMLAudioElement;
    public constructor(info) {
        this.#typings.push(new TypeArea(wordEle, info.word));
        // 将第一个汉译添加到打字区
        this.#createElement('div', mainTrasEle,
            { className: 'main-zh', textContent: info.mainTra.type + ' ' + info.mainTra.zh });

        // 将拼音推送到打字区
        info.mainTra.py.forEach(p => {
            // TODO: 需要跳过全部非拼音的块
            this.#typings.push(new TypeArea(this.#createElement('span', mainTrasEle, { className: 'py' }), p));
        })
        // 创建其他翻译
        for (let { type, tras } of info.tras) {
            this.#createElement('div', trasEle, { textContent: type + ' ' + tras.join('; ') });
        }
        // 下载语音
        this.#enAudio = enAudioGeter.getAudio(info.word);
        this.#zhAudio = zhAudioGeter.getAudio(info.mainTra.zh);
        // this.enAudio = getAudio(info.word, 'en');
        // this.zhAudio = getAudio(info.mainTra.zh, 'zh');
    }

    #createElement(type, patent = undefined, atts = null) {
        let buf = createElement(type, patent, atts);
        this.#releaseElems.push(buf);
        return buf;
    }

    public next(key) {
        if (this.#typings[this.#index].next(key))
            if (this.#index++ === 0) {
                this.#enAudio.safePlay();
                this.#enAudio.onended = () => this.#zhAudio.safePlay();
            }

        return this.#index >= this.#typings.length;
    }

    release() {
        this.#typings.forEach(t => t.release());
        this.#releaseElems.forEach(e => e.remove());
    }
}