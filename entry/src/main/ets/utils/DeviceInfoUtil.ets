import {batteryInfo} from '@kit.BasicServicesKit';
import { Logger } from './Logger';

export default class DeviceInfoUtil {
  private DeviceInfoUtil() {}

  /**
   * 获取设备电量信息
   * @returns 设备剩余电池电量百分比
   */
  public static getBatteryValue(): string {
    let batterySOCInfo: number = batteryInfo.batterySOC;
    Logger.info("batterySOCInfo: " + batterySOCInfo);
    return batterySOCInfo.toString();
  }
}