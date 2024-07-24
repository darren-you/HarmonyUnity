import window from '@ohos.window';
import pasteboard from '@ohos.pasteboard';
import { GetFromGlobalThis } from '../common/GlobalThisUtil';
import { TuanjieLog } from '../common/TuanjieLog';
import { DisplayInfoManager } from '../utils/DisplayInfoManager'
import { DebuggerDialogInfo } from './DebuggerDialogInfo';
import { APP_KEY_XCOMPONENT_WIDTH, APP_KEY_XCOMPONENT_HEIGHT } from '../common/Constants';
import tuanjie from 'libtuanjie.so'

// These MUST be synchronized with ScreenManager.h
enum ScreenOrientation
{
  kScreenOrientationUnknown,

  kPortrait,
  kPortraitUpsideDown,
  kLandscapeLeft,
  kLandscapeRight,

  kAutoRotation,

  kScreenOrientationCount
};

export class WindowUtils {
  static readonly MainWindowKey = "TuanjieMainWindow";
  static nativeToOpenHarmonyOrientationMap: Map<number, window.Orientation> = (() => {
    let orientationMap = new Map<number, window.Orientation>();
    orientationMap.set(ScreenOrientation.kScreenOrientationUnknown, window.Orientation.UNSPECIFIED);
    orientationMap.set(ScreenOrientation.kPortrait, window.Orientation.PORTRAIT);
    orientationMap.set(ScreenOrientation.kPortraitUpsideDown, window.Orientation.PORTRAIT_INVERTED);
    // orientationMap.set(ScreenOrientation.kLandscapeLeft, window.Orientation.LANDSCAPE_INVERTED);
    // orientationMap.set(ScreenOrientation.kLandscapeRight, window.Orientation.LANDSCAPE);
    // Todo: 2024/7/18 darren 经与华为确认是HarmonyOS NEXT 与 团结引擎兼容适配问题，暂时对调两个方向设定，后续团结引擎会适配修复
    orientationMap.set(ScreenOrientation.kLandscapeLeft, window.Orientation.LANDSCAPE);
    orientationMap.set(ScreenOrientation.kLandscapeRight, window.Orientation.LANDSCAPE_INVERTED);
    orientationMap.set(ScreenOrientation.kAutoRotation, window.Orientation.AUTO_ROTATION);
    return orientationMap;
  })();

  static getMainWindow(): window.Window{
    return GetFromGlobalThis(WindowUtils.MainWindowKey);
  }

  static setWindowSizeChangeCallback() {
    let windowClass: window.Window = WindowUtils.getMainWindow();
    try {
      windowClass.on('windowSizeChange', (size) => {
        WindowUtils.setXComponentSizeWithSafeArea(size.width, size.height, tuanjie.nativeGetIsRenderOutsizeSafeArea());
      })
    }
    catch (err) {
      TuanjieLog.error('setWindowSizeChangeCallback failed, reason: ' + JSON.stringify(err))
    }
  }

  static setWindowAvoidAreaChangeCallBack() {
    let windowClass: window.Window = WindowUtils.getMainWindow();
    try {
      windowClass.on('avoidAreaChange', (data) => {
        let safeArea = WindowUtils.getSafeAreaWithNativeFormat();
        tuanjie.nativeGetIsAvoidAreaChange(safeArea);
      })
    }
    catch (err) {
      TuanjieLog.error('setWindowAvoidAreaChangeCallBack failed, reason: ' + JSON.stringify(err))
    }
  }

  static setSystemBarState(systemBars: Array<string>) {
    let windowClass: window.Window = WindowUtils.getMainWindow();
    let requestedBars: ("status" | "navigation")[] = systemBars as ("status" | "navigation")[];
    windowClass.setWindowSystemBarEnable(requestedBars, (err) => {
      if (err.code) {
        console.error('Failed to set the system bar to be invisible. Cause:' + JSON.stringify(err));
        return;
      }
      console.info('Succeeded in setting the system bar to be invisible.');
    });
  }

  static setOrientation(orientNum: number) {
    if (!WindowUtils.nativeToOpenHarmonyOrientationMap.has(orientNum))
      return;
    let orientation: window.Orientation = WindowUtils.nativeToOpenHarmonyOrientationMap.get(orientNum);
    let windowClass: window.Window = WindowUtils.getMainWindow();
    windowClass.setPreferredOrientation(orientation).then(() => {
      TuanjieLog.info('Succeeded in setting the window orientation.');
    }).catch((err) => {
      TuanjieLog.error('Failed to set the window orientation. Cause: ' + JSON.stringify(err));
    })
  }

  static getWindowAvoidArea() {
    let windowClass: window.Window = WindowUtils.getMainWindow();
    if (windowClass == null || windowClass == undefined)
      return null;
    return windowClass.getWindowAvoidArea(window.AvoidAreaType.TYPE_CUTOUT);
  }

  static calculateSafeArea(width: number, heiget: number): window.Rect {
    let avoidArea: window.AvoidArea = WindowUtils.getWindowAvoidArea();
    if (avoidArea == null)
      return null;
    let safeAreaLeft = avoidArea.leftRect.left + avoidArea.leftRect.width;
    let safeAreaTop = avoidArea.topRect.top + avoidArea.topRect.height;
    let safeAreaWidth = (avoidArea.rightRect.left != 0 ? avoidArea.rightRect.left : width) - safeAreaLeft;
    let safeAreaHeight = (avoidArea.bottomRect.top != 0 ? avoidArea.bottomRect.top : heiget) - safeAreaTop;
    return { left: safeAreaLeft, top: safeAreaTop, width: safeAreaWidth, height: safeAreaHeight };
  }

  static getSafeAreaWithNativeFormat() {
    let windowRect = WindowUtils.getMainWindow().getWindowProperties().windowRect;
    let safeArea = WindowUtils.calculateSafeArea(windowRect.width, windowRect.height);
    if (safeArea == null)
      return [0, 0, 0, 0];
    return [safeArea.left, safeArea.top, safeArea.width, safeArea.height];
  }

  static setXComponentSizeWithSafeArea(width: number, height: number, renderOutside: boolean) {
    if (width == 0 || height == 0) {
      let properties = WindowUtils.getMainWindow().getWindowProperties();
      width = properties.windowRect.width;
      height = properties.windowRect.height;
    }
    let xComponentWidth: number, xComponentHeight: number;
    if (renderOutside) {
      xComponentWidth = width;
      xComponentHeight = height;
    } else {
      let safeArea = WindowUtils.calculateSafeArea(width, height);
      if (safeArea == null)
        return;
      xComponentWidth = safeArea.width;
      xComponentHeight = safeArea.height;
    }
    AppStorage.setOrCreate<string>(APP_KEY_XCOMPONENT_WIDTH, `${xComponentWidth}px`);
    AppStorage.setOrCreate<string>(APP_KEY_XCOMPONENT_HEIGHT, `${xComponentHeight}px`);
  }

  static fillCutoutArray(uint16Array: Uint16Array, rect: window.Rect, startIdx: number) {
    uint16Array[startIdx++] = rect.left;
    uint16Array[startIdx++] = rect.top;
    uint16Array[startIdx++] = rect.width;
    uint16Array[startIdx++] = rect.height;
    return startIdx;
  }

  static getCutouts(arrayBuffer: ArrayBuffer) {
    let avoidArea: window.AvoidArea = WindowUtils.getWindowAvoidArea();
    if (avoidArea == null)
      return null;
    let uint16Array = new Uint16Array(arrayBuffer);
    let startIndex: number = 0;
    startIndex = WindowUtils.fillCutoutArray(uint16Array, avoidArea.leftRect, startIndex);
    startIndex = WindowUtils.fillCutoutArray(uint16Array, avoidArea.topRect, startIndex);
    startIndex = WindowUtils.fillCutoutArray(uint16Array, avoidArea.rightRect, startIndex);
    startIndex = WindowUtils.fillCutoutArray(uint16Array, avoidArea.bottomRect, startIndex);
    return arrayBuffer;
  }

  static setScreenOn(value) {
    let windowClass: window.Window = WindowUtils.getMainWindow();
    // only kNeverSleep & kSystemSetting are supported like other platforms
    windowClass.setWindowKeepScreenOn(value);
  }

  static async getPasteboard(): Promise<any> {
    let sysPasteBoard = pasteboard.getSystemPasteboard();
    let pasteData = await sysPasteBoard.getData();
    if (pasteData) {
      return pasteData.getPrimaryText();
    }
    return "";
  }

  static async setPasteboard(content: string): Promise<boolean> {
    let sysPasteBoard = pasteboard.getSystemPasteboard();
    let hasData = await sysPasteBoard.hasData();
    if (hasData) {
      let pasteData = await sysPasteBoard.getData();
      let record = pasteboard.createRecord(pasteboard.MIMETYPE_TEXT_PLAIN, content);
      pasteData.replaceRecord(0, record);
      await sysPasteBoard.setData(pasteData);
    } else {
      let pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, content);
      await sysPasteBoard.setData(pasteData);
    }
    return true;
  }

  static showSingleButtonDialog(dialogTitle: string, dialogMessage: string, dialogButtonText = "OK") {
    DebuggerDialogInfo.setDebuggerDialogInfo(dialogTitle, dialogMessage, dialogButtonText, true);
  }

}