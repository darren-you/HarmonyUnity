import { TuanjieMainWorker as TuanjieMainWorker } from '../workers/TuanjieMainWorker';
import { TuanjieLog } from '../common/TuanjieLog';
import { SoftInputDialog } from './SoftInputDialog'
import { VideoPlayer } from './VideoPlayer'
import { GetFromGlobalThis, SetToGlobalThis } from '../common/GlobalThisUtil';
import resourceManager from '@ohos.resourceManager';
import {WebviewInfo, TuanjieWebview} from "./TuanjieWebview"
import { APP_KEY_XCOMPONENT_WIDTH, APP_KEY_XCOMPONENT_HEIGHT, APP_KEY_ORIENTATION_CHANGE } from '../common/Constants';
import { WindowUtils } from '../utils/WindowUtils'
import { DebuggerDialogInfo } from '../utils/DebuggerDialogInfo'
import { DebuggerDialog } from './DebuggerDialog'
import tuanjie from 'libtuanjie.so'

@Entry
@Component
struct TuanjiePlayer {
  tuanjieMainWorker = TuanjieMainWorker.getInstance();
  @State webviewInfo: WebviewInfo = new WebviewInfo(0,0,0,0);
  @StorageProp(APP_KEY_XCOMPONENT_WIDTH) xComponentWidth: string = '0px';
  @StorageProp(APP_KEY_XCOMPONENT_HEIGHT) xComponentHeight: string = '0px';
  @StorageProp(APP_KEY_ORIENTATION_CHANGE) @Watch('updateOrientation') orientation: number = 0;
  @State debuggerDialogInfo : DebuggerDialogInfo = new DebuggerDialogInfo("","","",false);
  @State vAlign: FlexAlign = FlexAlign.End;
  @State hAlign: FlexAlign = FlexAlign.End;

  updateOrientation() {
    // portrait upside down
    this.vAlign = this.orientation == 2 ? FlexAlign.Start : FlexAlign.End;
    // landscape right
    this.hAlign = this.orientation == 1 ? FlexAlign.Start : FlexAlign.End;
  }

  dialogController = new CustomDialogController({
    builder: SoftInputDialog({
      // showMessage: this.showMessage,
      onTextChange: (msg: string) => {
        TuanjieLog.debug("CustomDialogController onTextChange " + msg);
        TuanjieMainWorker.getInstance().postMessage({ type: 'SoftInput_onTextChange', data: msg });
      },
      onTextSelectionChange: (start: number, end: number) => {
        TuanjieLog.debug("CustomDialogController onTextSelectionChange start: " + start.toString() + ", end: " + end.toString());
        TuanjieMainWorker.getInstance().postMessage({ type: 'SoftInput_onTextSelectionChange', start: start, length: end - start });
      },
      accept: (msg: string) => {
        TuanjieLog.debug("CustomDialogController accept" + msg);
        TuanjieMainWorker.getInstance().postMessage({ type: 'SoftInput_accept', data: msg });
      },
    }),
    cancel: () => {
      TuanjieLog.debug("CustomDialogController cancel");
      TuanjieMainWorker.getInstance().postMessage({ type: 'SoftInput_accept', data: null });
    },
    autoCancel: true,
    alignment: DialogAlignment.Bottom,
    customStyle: true,
  })

  onPageShow() {
    TuanjieLog.info('%{public}s', 'onPageShow');
    this.updateOrientation();
    WindowUtils.setXComponentSizeWithSafeArea(0, 0, tuanjie.nativeGetIsRenderOutsizeSafeArea());
    SetToGlobalThis('dialogController', this.dialogController);
    SetToGlobalThis('webviewInfo', this.webviewInfo);
    SetToGlobalThis(DebuggerDialogInfo.DebuggerDialogInfoKey, this.debuggerDialogInfo);
  }

  onPageHide() {
    TuanjieLog.info('%{public}s', 'onPageHide');
  }

  build() {
    Row() {
      Column() {
        Stack() {
          XComponent({ id: 'TuanjiePlayer', type: 'surface', libraryname: 'tuanjie' })
            .onLoad((context) => {
              TuanjieLog.info('%{public}s', 'XComponent onLoad');
            })
            .onDestroy(() => {
              TuanjieLog.info('%{public}s', 'XComponent onDestroy');
            })
            .onAppear(() => {
              TuanjieLog.info('%{public}s', 'XComponent onAppear');
            })
            .onDisAppear(() => {
              TuanjieLog.info('%{public}s', 'XComponent onDisAppear');
            })
            .width(this.xComponentWidth)
            .height(this.xComponentHeight)

          TuanjieWebview({viewInfo: this.webviewInfo});

          StaticSplashScreen()
          VideoPlayer()
          if (this.debuggerDialogInfo.Showing)
          {
            DebuggerDialog({debuggerDialogInfo: this.debuggerDialogInfo})
          }
        }
      }
      .height('100%')
      .backgroundColor('#ff000000')
      .justifyContent(this.vAlign)
    }
    .width('100%')
    .backgroundColor('#ff000000')
    .justifyContent(this.hAlign)
  }
}

@Component
struct StaticSplashScreen {
  @State showStaticSplashScreen: boolean = GetFromGlobalThis('showStaticSplashScreen');
  @State imageFit: ImageFit = 0;

  async aboutToAppear() {
    let resourceManager = getContext(this).resourceManager;
    let resConf = $r('app.integer.StaticSplashScreenFit');
    let resource: resourceManager.Resource = {
      bundleName: resConf.bundleName,
      moduleName: resConf.moduleName,
      id: resConf.id
    }
    this.imageFit = await resourceManager.getNumber(resource);
    setTimeout(() => {
      this.showStaticSplashScreen = false
    }, 2600)
  }

  build() {
    Stack() {
      if (this.showStaticSplashScreen)
        Image($r('app.media.startIcon')).objectFit(this.imageFit)
    }
  }
}
