// 下载有道的音频
class YouDaoAudioGetter {
    public language: string;

    constructor(language: string) {
        this.language = language;
    }

    public getAudio(text: string): SafeHTMLAudioElement {
        let audio = new Audio() as SafeHTMLAudioElement;
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
        }

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