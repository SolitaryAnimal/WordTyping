var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
// 此文件保存音频相关的来源
var wordList = null;
var word = null;
function createNextWord() {
    if (word)
        word.release();
    word = new Word(wordList.shift());
}
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
    // wordEle.textContent = '按任意键开始';
    // document.addEventListener("keypress", ready);
    createNextWord();
    document.addEventListener("keypress", (event) => {
        if (word.next(event.key))
            createNextWord();
    });
}
fetch('./words.json').then(r => r.text()).then(t => init(t));
var _WordTypeBlock_index, _WordTypeBlock_wordList, _WordTypeBlock_passEle, _WordTypeBlock_orginMask, _WordTypeBlock_orginEle, _WordTypeBlock_width, _SignTypeBloc_textBlock;
class BaseTypeBlock {
    constructor(parent) {
        this.eleArray = [];
        this.parent = createElement('div', parent, { className: "type-block" });
    }
    release() {
        this.parent.remove();
    }
    createElement(text, parent = this.parent) {
        return createElement('span', parent, { textContent: text });
    }
}
// 单词打字区, 一组需要输入的连续字符
class WordTypeBlock extends BaseTypeBlock {
    constructor(parent, word) {
        super(parent);
        _WordTypeBlock_index.set(this, 0);
        _WordTypeBlock_wordList.set(this, []);
        _WordTypeBlock_passEle.set(this, void 0);
        _WordTypeBlock_orginMask.set(this, void 0);
        _WordTypeBlock_orginEle.set(this, void 0);
        _WordTypeBlock_width.set(this, void 0);
        __classPrivateFieldSet(this, _WordTypeBlock_orginMask, createElement('div', this.parent, { className: "orginMask" }), "f");
        __classPrivateFieldSet(this, _WordTypeBlock_orginEle, createElement('div', __classPrivateFieldGet(this, _WordTypeBlock_orginMask, "f"), { className: "orgin" }), "f");
        __classPrivateFieldSet(this, _WordTypeBlock_passEle, createElement('div', this.parent, { className: "pass", style: "width:0;" }), "f");
        for (let i of word) {
            var buf = this.createElement(i, __classPrivateFieldGet(this, _WordTypeBlock_orginEle, "f"));
            if (isCM(i))
                __classPrivateFieldGet(this, _WordTypeBlock_wordList, "f").push(buf);
            // 用于动画
            this.createElement(i, __classPrivateFieldGet(this, _WordTypeBlock_passEle, "f"));
        }
        __classPrivateFieldSet(this, _WordTypeBlock_width, __classPrivateFieldGet(this, _WordTypeBlock_orginEle, "f").offsetWidth, "f");
        this.parent.setAttribute('style', `width: ${__classPrivateFieldGet(this, _WordTypeBlock_width, "f")}px; height: ${__classPrivateFieldGet(this, _WordTypeBlock_orginEle, "f").offsetHeight}px`);
        __classPrivateFieldGet(this, _WordTypeBlock_orginMask, "f").setAttribute('style', `width: ${__classPrivateFieldGet(this, _WordTypeBlock_width, "f")}px; height: ${__classPrivateFieldGet(this, _WordTypeBlock_orginEle, "f").offsetHeight}px`);
    }
    // 初始化最开始的符号元素效果
    init() {
        for (const iterator of this.eleArray) {
            if (iterator === __classPrivateFieldGet(this, _WordTypeBlock_wordList, "f")[0])
                return;
            iterator.className = 'pass';
        }
    }
    next(key) {
        var _a, _b, _c;
        var _d, _e;
        if ((_c = key === ((_b = (_a = __classPrivateFieldGet(this, _WordTypeBlock_wordList, "f")[__classPrivateFieldGet(this, _WordTypeBlock_index, "f")]) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.toLowerCase())) !== null && _c !== void 0 ? _c : false) {
            // 跳过非字母的部分
            do {
                __classPrivateFieldSet(this, _WordTypeBlock_index, (_d = __classPrivateFieldGet(this, _WordTypeBlock_index, "f"), _d++, _d), "f");
            } while (__classPrivateFieldGet(this, _WordTypeBlock_index, "f") < __classPrivateFieldGet(this, _WordTypeBlock_wordList, "f").length && !isAllWord(__classPrivateFieldGet(this, _WordTypeBlock_wordList, "f")[__classPrivateFieldGet(this, _WordTypeBlock_index, "f")].textContent));
            // 更新显示颜色
            let ele = __classPrivateFieldGet(this, _WordTypeBlock_wordList, "f")[__classPrivateFieldGet(this, _WordTypeBlock_index, "f") - 1];
            __classPrivateFieldGet(this, _WordTypeBlock_passEle, "f").setAttribute('style', `width: ${ele.offsetLeft + ele.offsetWidth}px`);
            __classPrivateFieldGet(this, _WordTypeBlock_orginMask, "f").style.width = __classPrivateFieldGet(this, _WordTypeBlock_width, "f") - ele.offsetLeft + 'px';
            __classPrivateFieldGet(this, _WordTypeBlock_orginMask, "f").style.left = ele.offsetLeft + 'px';
            __classPrivateFieldGet(this, _WordTypeBlock_orginEle, "f").style.left = -ele.offsetLeft + 'px';
        }
        else {
            // 输入错误的话就从头开始
            for (; __classPrivateFieldGet(this, _WordTypeBlock_index, "f") >= 0; __classPrivateFieldSet(this, _WordTypeBlock_index, (_e = __classPrivateFieldGet(this, _WordTypeBlock_index, "f"), _e--, _e), "f")) {
                __classPrivateFieldGet(this, _WordTypeBlock_wordList, "f")[__classPrivateFieldGet(this, _WordTypeBlock_index, "f")].removeAttribute('class');
            }
            __classPrivateFieldSet(this, _WordTypeBlock_index, 0, "f");
            __classPrivateFieldGet(this, _WordTypeBlock_passEle, "f").setAttribute('style', 'width: 0');
        }
        // 如果输入完毕将生成下一个单词
        return __classPrivateFieldGet(this, _WordTypeBlock_index, "f") >= __classPrivateFieldGet(this, _WordTypeBlock_wordList, "f").length;
    }
}
_WordTypeBlock_index = new WeakMap(), _WordTypeBlock_wordList = new WeakMap(), _WordTypeBlock_passEle = new WeakMap(), _WordTypeBlock_orginMask = new WeakMap(), _WordTypeBlock_orginEle = new WeakMap(), _WordTypeBlock_width = new WeakMap();
// 符号打字区, 不需要输入
class SignTypeBloc extends BaseTypeBlock {
    constructor(parent, word) {
        super(parent);
        _SignTypeBloc_textBlock.set(this, void 0);
        __classPrivateFieldSet(this, _SignTypeBloc_textBlock, this.createElement(word), "f");
    }
    next(key) {
        __classPrivateFieldGet(this, _SignTypeBloc_textBlock, "f").className = 'pass';
        return true;
    }
}
_SignTypeBloc_textBlock = new WeakMap();
// 创建元素的快捷方式
function createElement(type, patent = null, atts = null) {
    let buf = document.createElement(type);
    if (patent)
        patent.appendChild(buf);
    if (!atts)
        return buf;
    for (let att in atts) {
        buf[att] = atts[att];
    }
    return buf;
}
// 字符是否是小写字母
function isCM(target) {
    if (target.length > 1)
        throw new Error("本函数只能使用字符!");
    let v = target.charCodeAt(0);
    return (v >= 87 && 122 >= v);
}
// 字符串是否全由小写字母组成
function isAllWord(target) {
    for (let index = 0; index < target.length; index++) {
        let v = target.charCodeAt(index);
        if (v < 87 || 122 < v)
            return false;
    }
    return true;
}
function isAllSign(target) {
    for (let index = 0; index < target.length; index++) {
        let v = target.charCodeAt(index);
        if (v >= 87 && 122 >= v)
            return false;
    }
    return true;
}
var _Word_instances, _Word_typings, _Word_index, _Word_releaseElems, _Word_enAudio, _Word_zhAudio, _Word_createElement;
const wordEle = document.querySelector('#word');
const mainTra = {
    "type": document.querySelector('#main-tra .type'),
    "zh": document.querySelector('#main-tra .zh'),
    "pys": document.querySelector('#main-tra .pys')
};
const trasEle = document.querySelector('#tras');
class Word {
    constructor(info) {
        _Word_instances.add(this);
        _Word_typings.set(this, []);
        _Word_index.set(this, 0);
        _Word_releaseElems.set(this, []);
        _Word_enAudio.set(this, void 0);
        _Word_zhAudio.set(this, void 0);
        // 将单词推向打字区
        __classPrivateFieldGet(this, _Word_typings, "f").push(new WordTypeBlock(wordEle, info.word));
        // 将第一个汉译添加
        mainTra.type.textContent = info.mainTra.type;
        mainTra.zh.textContent = info.mainTra.zh;
        // 将拼音推送到打字区
        info.mainTra.py.forEach(p => {
            if (isAllSign(p)) {
                __classPrivateFieldGet(this, _Word_typings, "f").push(new SignTypeBloc(mainTra.pys, p));
            }
            else {
                __classPrivateFieldGet(this, _Word_typings, "f").push(new WordTypeBlock(mainTra.pys, p));
            }
        });
        // 创建其他翻译
        for (let { type, tras } of info.tras) {
            let tr = __classPrivateFieldGet(this, _Word_instances, "m", _Word_createElement).call(this, 'tr', trasEle);
            __classPrivateFieldGet(this, _Word_instances, "m", _Word_createElement).call(this, 'td', tr, { textContent: type, className: 'type' });
            __classPrivateFieldGet(this, _Word_instances, "m", _Word_createElement).call(this, 'td', tr, { textContent: tras.join('; '), className: 'zh' });
        }
        // 下载语音
        __classPrivateFieldSet(this, _Word_enAudio, enAudioGeter.getAudio(info.word), "f");
        __classPrivateFieldSet(this, _Word_zhAudio, zhAudioGeter.getAudio(info.mainTra.zh), "f");
    }
    next(key) {
        var _a, _b;
        let block = __classPrivateFieldGet(this, _Word_typings, "f")[__classPrivateFieldGet(this, _Word_index, "f")];
        if (block.next(key))
            if ((__classPrivateFieldSet(this, _Word_index, (_b = __classPrivateFieldGet(this, _Word_index, "f"), _a = _b++, _b), "f"), _a) === 0) {
                __classPrivateFieldGet(this, _Word_enAudio, "f").safePlay();
                __classPrivateFieldGet(this, _Word_enAudio, "f").onended = () => __classPrivateFieldGet(this, _Word_zhAudio, "f").safePlay();
            }
        block = __classPrivateFieldGet(this, _Word_typings, "f")[__classPrivateFieldGet(this, _Word_index, "f")];
        if (block instanceof WordTypeBlock)
            block.init();
        return __classPrivateFieldGet(this, _Word_index, "f") >= __classPrivateFieldGet(this, _Word_typings, "f").length;
    }
    release() {
        __classPrivateFieldGet(this, _Word_typings, "f").forEach(t => t.release());
        __classPrivateFieldGet(this, _Word_releaseElems, "f").forEach(e => e.remove());
    }
}
_Word_typings = new WeakMap(), _Word_index = new WeakMap(), _Word_releaseElems = new WeakMap(), _Word_enAudio = new WeakMap(), _Word_zhAudio = new WeakMap(), _Word_instances = new WeakSet(), _Word_createElement = function _Word_createElement(type, patent = undefined, atts = null) {
    let buf = createElement(type, patent, atts);
    __classPrivateFieldGet(this, _Word_releaseElems, "f").push(buf);
    return buf;
};
// 单词信息的接口
// 下载有道的音频
class YouDaoAudioGetter {
    constructor(language) {
        this.language = language;
    }
    getAudio(text) {
        let audio = new Audio();
        audio.isLoaded = false;
        audio.addEventListener('loadeddata', () => {
            audio.isLoaded = true;
        });
        // 安全播放确保音频加载结束后才进行播放
        audio.safePlay = () => {
            if (audio.isLoaded) {
                audio.play();
                return;
            }
            audio.addEventListener('loadeddata', () => {
                audio.isLoaded = true;
                audio.play();
            });
        };
        fetch(`./api/voice?audio=${text}&le=${this.language}`)
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
}
const enAudioGeter = new YouDaoAudioGetter('en');
const zhAudioGeter = new YouDaoAudioGetter('zh');
//# sourceMappingURL=script.js.map