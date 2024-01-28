function createElement(type, patent = undefined, atts = null) {
    let buf = document.createElement(type);
    if (patent) patent.appendChild(buf);
    if (!atts) return buf;
    for (let att in atts) {
        buf[att] = atts[att];
    }
    return buf;
}

function getAudio(word, lang) {
    let audio = new Audio();
    audio.down = false;
    audio.addEventListener('loadeddata', () => {
        audio.down = true;
    });
    audio.play_s = () => {
        if (audio.down) {
            audio.play();
            return;
        }
        audio.addEventListener('loadeddata', () => {
            audio.down = true;
            audio.play();
        });
    }

    fetch(`./api/voice?audio=${word}&le=${lang}`)
        .then(response => {
            if (!response.ok)
                throw new Error('Failed to download audio');
            return response.blob();
        }).then(blob => {
            // 将下载的音频 Blob 对象赋给 Audio 对象
            audio.src = URL.createObjectURL(blob);
            return audio;
        });
    return audio;
}

// 打字区, 管理需要输入的一串字符
class TypingLvevl {
    #length = 0;
    #index = 0;
    #wordList = [];
    constructor(parent, word) {
        this.parent = parent;
        // this.parent.innerHTML = '';
        this.#length = word.length;
        this.#index = 0;
        this.#wordList.length = 0;

        for (let i of word) {
            this.#wordList.push(createElement('span', this.parent, { textContent: i }));
        }
    }

    next(key) {
        if (key === this.#wordList[this.#index].textContent.toLowerCase()) {
            // TODO: 需要跳过非字母的部分
            this.#wordList[this.#index++].className = 'pass';
        } else {
            // 输入错误的话就从头开始
            for (; this.#index >= 0; this.#index--) {
                this.#wordList[this.#index].removeAttribute('class');
            }
            this.#index = 0;
        }
        // 如果输入完毕将生成下一个单词
        return this.#index >= this.#length;
    }

    release() {
        this.#wordList.forEach(w => w.remove());
    }
}


const wordEle = document.querySelector('.main .word');
const mainTrasEle = document.querySelector('.main .main-tra');
const trasEle = document.querySelector('.main .tras');

// 单词类, 管理一个单词
class Word {
    #typings = [];
    #index = 0;
    #releaseElems = [];
    #enAudio;
    #zhAudio;
    constructor(info) {
        this.#typings.push(new TypingLvevl(wordEle, info.word));
        // 将第一个汉译添加到打字区
        this.#createElement('div', mainTrasEle,
            { className: 'main-zh', textContent: info.mainTra.type + ' ' + info.mainTra.zh });

        // 将拼音推送到打字区
        info.mainTra.py.forEach(p => {
            //TODO: 需要跳过全部非拼音的块
            this.#typings.push(new TypingLvevl(this.#createElement('span', mainTrasEle, { className: 'py' }), p));
        })
        // 创建其他翻译
        for (let { type, tras } of info.tras) {
            this.#createElement('div', trasEle, { textContent: type + ' ' + tras.join('; ') });
        }
        // 下载语音
        this.#enAudio = getAudio(info.word, 'en');
        this.#zhAudio = getAudio(info.mainTra.zh, 'zh');
    }

    #createElement(type, patent = undefined, atts = null) {
        let buf = createElement(type, patent, atts);
        this.#releaseElems.push(buf);
        return buf;
    }

    next(key) {
        if (this.#typings[this.#index].next(key))
            if (this.#index++ === 0) {
                this.#enAudio.play_s();
                this.#enAudio.onended = () => this.#zhAudio.play_s();
            }

        return this.#index >= this.#typings.length;
    }

    release() {
        this.#typings.forEach(t => t.release());
        this.#releaseElems.forEach(e => e.remove());
    }
}


var wordList = null;
var word = null;

function ready(event) {
    document.removeEventListener("keypress", ready);
    wordEle.innerHTML = '';
    createNextWord();

    document.addEventListener("keypress", (event) => {
        if (word.next(event.key))
            createNextWord();
    });
}

function init(data) {
    wordList = JSON.parse(data);
    wordEle.textContent = '按任意键开始';
    document.addEventListener("keypress", ready);
}

function createNextWord() {
    if (word) word.release();
    word = new Word(wordList.shift());
}

fetch('./words.json').then(r => r.text()).then(t => init(t));