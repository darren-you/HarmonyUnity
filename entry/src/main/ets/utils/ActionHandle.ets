import DeviceInfoUtil from './DeviceInfoUtil';
import { Logger } from './Logger';

export default class ActionHandle {
  private ActionHandle() {}

  /**
   * 处理action事件
   */
  static action(actionCode: number, actionValue: string): string {
    let result: string = "";
    switch (actionCode) {
      case 1:
        Logger.info("actionCode: " + actionCode + " actionValue: " + actionValue);
        result = DeviceInfoUtil.getBatteryValue();
        Logger.info("batteryData: " + result);
        break;
      case 2:
        Logger.info("actionCode: " + actionCode + " actionValue: " + actionValue);
        break;
      default:
        Logger.info("actionCode: " + actionCode + " actionValue: " + actionValue);
        break;
    }
    return result;
  }
}

export class  ActionCode {
  static ACTION_CODE_BATTERY = 148;
  static ACTION_CODE_TEST = 1;
}