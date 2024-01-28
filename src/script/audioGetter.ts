// 此文件保存音频相关的来源

// 含有安全播放功能的HTMLAudioElement
interface SafeHTMLAudioElement extends HTMLAudioElement {
    isLoaded: boolean;
    safePlay(): void;
}


// 返回SafeHTMLAudioElement的构造器
interface TextAudioGetter {
    getAudio(text: string): SafeHTMLAudioElement;
}