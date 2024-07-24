import tuanjie from 'libtuanjie.so';

export class VideoInfo {
    public url: string = ""
    public bgColor: number = 0
    public controlMode: number = 0
    public scalingMode: number = 0
    public isPlaying: boolean = false

    Init(url: string, bgColor: number, controlMode: number, scalingMode: number) {
        this.url = url
        this.bgColor = bgColor
        this.controlMode = controlMode
        this.scalingMode = scalingMode
        this.isPlaying = true
    }
}

export class VideoPlayerProxy {
    static ShowVideoPlayer(path: string, backgroundColor: number, controlMode: number,  scalingMode: number) {
        let videoInfo = new VideoInfo()
        videoInfo.Init(path, backgroundColor, controlMode, scalingMode)
        AppStorage.setOrCreate('VideoInfo', videoInfo);
        return true;
    }

    static OnVideoStart() {
        tuanjie.nativeOnPause();
    }

    static OnVideoStop() {
        tuanjie.nativeOnResume();
    }
}
