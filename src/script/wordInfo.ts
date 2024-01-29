// 单词信息的接口

interface TraInfo {
    "type": string;
    "tras": Array<string>;
}


interface MainTraInfo {
    "type": string;
    "zh": string;
    "py": Array<string>;
}


interface WordInfo {
    "word": string;
    "tras": Array<TraInfo>;
    "mainTra": MainTraInfo;
}