import { deviceInfo } from '@kit.BasicServicesKit';
import hilog from '@ohos.hilog';
import promptAction from '@ohos.promptAction';

export default class MyHarmonyBridge {
  private static NUMBER = 0x001;
  private static TAG = "MyHarmonyBridge";
  private static instance: MyHarmonyBridge;

  public static getInstance() {
    if (MyHarmonyBridge.instance == null) {
      MyHarmonyBridge.instance = new MyHarmonyBridge();
    }
    return MyHarmonyBridge.instance;
  }

  // action事件
  public doAction(actionCode: number, actionData: string): string {
    hilog.info(MyHarmonyBridge.NUMBER, MyHarmonyBridge.TAG, "doaction > actionCode: " + actionCode + " actionData: " + actionData);
    return "success actionCode: " + actionCode + " actionData: " + actionData;
  }

  // 获取数据
  public getData(dataKey: string, dataValue: string): string {
    hilog.info(MyHarmonyBridge.NUMBER, MyHarmonyBridge.TAG, "getData > dataKey: " + dataKey + " dataValue: " + dataValue);

    let deviceTypeInfo: string = deviceInfo.deviceType;
    let marketNameInfo: string = deviceInfo.marketName;
    let productSeriesInfo: string = deviceInfo.productSeries;
    let displayVersionInfo: string = deviceInfo.displayVersion;
    let data = JSON.stringify({
      deviceTypeInfo: deviceTypeInfo,
      marketNameInfo: marketNameInfo,
      productSeriesInfo: productSeriesInfo,
      displayVersionInfo: displayVersionInfo
    });

    // 回调给Unity
    if (globalThis.messageCallback != null) {
      globalThis.messageCallback(data);
    }

    return data;
  }

  // Toast
  public showToast(msg: string) {
    hilog.info(MyHarmonyBridge.NUMBER, MyHarmonyBridge.TAG, "showToast: " + msg);
    promptAction.showToast({
      message: msg,
      duration: 2000,
    });
  }

  // 初始化
  public initSDK(callback: (msg: string) => void) {
    hilog.info(MyHarmonyBridge.NUMBER, MyHarmonyBridge.TAG, "initSDK callback: " + callback);
    globalThis.messageCallback = callback;
    // 初始化逻辑 ...
  }

  // 登录
  public login(loginStyle: string) {
    hilog.info(MyHarmonyBridge.NUMBER, MyHarmonyBridge.TAG, "login: " + loginStyle);
    // 登录逻辑 ...
  }

  // 发起支付
  public pay(payInfo: string) {
    hilog.info(MyHarmonyBridge.NUMBER, MyHarmonyBridge.TAG, "payInfo: " + payInfo);
    // 支付逻辑 ...
  }
  

}

// 注册插件类方法
export function RegisterMyHarmonyBridge() {
  let register:Record<string, Object> = {};
  register["MyHarmonyBridge"] = MyHarmonyBridge;
  return register;
}