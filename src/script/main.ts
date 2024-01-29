var wordList: Array<WordInfo> = null;
var word: Word = null;


function createNextWord(): void {
    if (word) word.release();
    word = new Word(wordList.shift());
}


function ready(event): void {
    document.removeEventListener("keypress", ready);
    wordEle.innerHTML = '';
    createNextWord();

    document.addEventListener("keypress", (event) => {
        if (word.next(event.key))
            createNextWord();
    });
}


function init(data: string): void {
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