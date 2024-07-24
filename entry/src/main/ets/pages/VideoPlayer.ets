import { VideoInfo } from '../utils/VideoPlayerProxy'
import { TuanjieMainWorker as TuanjieMainWorker } from '../workers/TuanjieMainWorker';
import { VideoPlayerProxy } from '../utils/VideoPlayerProxy'
import { TuanjieLog } from '../common/TuanjieLog';

@Component
export struct VideoPlayer {
  @StorageLink('VideoInfo') @Watch('onVideoInfoUpdated') videoInfo: VideoInfo = new VideoInfo()

  private controller:VideoController = new VideoController()
  private url: string = ''
  private bgColor: number = 0
  private controlShow: boolean = true
  private scalingMode: ImageFit = ImageFit.Contain

  onVideoInfoUpdated(propName: string): void {
    this.url = this.videoInfo.url
    this.bgColor = this.videoInfo.bgColor
    this.controlShow = this.videoInfo.controlMode < 2
    switch (this.videoInfo.scalingMode) {
      case 0:
        this.scalingMode = ImageFit.None
        break
      case 1:
        this.scalingMode = ImageFit.Contain
        break
      case 2:
        this.scalingMode = ImageFit.Cover
        break
      case 3:
        this.scalingMode = ImageFit.Fill
        break
    }
  }

  start(): void {
    VideoPlayerProxy.OnVideoStart()
  }

  stop(): void {
    this.videoInfo.isPlaying = false
    VideoPlayerProxy.OnVideoStop()
  }

  build() {
    if (this.videoInfo.isPlaying) {
      Stack() {
        Video({
          src: this.url,
          controller: this.controller
        })
          .controls(this.controlShow)
          .autoPlay(true)
          .objectFit(this.scalingMode)
          .loop(false)
          .onStart(() => {
            this.start()
          })
          .onFinish(() => {
            this.stop()
          })
          .onError(() => {
            this.stop()
          })
          .backgroundColor(this.bgColor)
          .onClick((event: ClickEvent) => {
            if (this.videoInfo.controlMode == 2) {
              this.stop()
            }
          })
      }
    }
  }
}