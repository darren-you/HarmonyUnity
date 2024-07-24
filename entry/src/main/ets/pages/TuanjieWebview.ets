import web_webview from '@ohos.web.webview'

export class WebviewInfo {
  // position
  public x: number = 0;
  public y: number = 0;

  // size
  public w: number = 0;
  public h: number = 0;

  // url
  public url: string = '';

  public visible: boolean = false;
  public occupyble: boolean = false;
  public controller: web_webview.WebviewController = new web_webview.WebviewController()

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  public reset() {
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.url = '';
    this.visible = false;
    this.occupyble = false;
  }
}

@Component
export struct TuanjieWebview {
  @Link viewInfo: WebviewInfo;
  build() {
    if(this.viewInfo.visible) {
      Web({ 
        src: this.viewInfo.url, 
        controller: this.viewInfo.controller
      })
        .position({ x: px2vp(this.viewInfo.x), y: px2vp(this.viewInfo.y) })
        .width(px2vp(this.viewInfo.w))
        .height(px2vp(this.viewInfo.h))
        .border({ width: 1 })
        .domStorageAccess(true)
        .databaseAccess(true)
        .imageAccess(true)
        .javaScriptAccess(true)
        .visibility(this.viewInfo.occupyble ? (this.viewInfo.visible ? Visibility.Visible : Visibility.Hidden) : Visibility.None)
      
    }
  }
}