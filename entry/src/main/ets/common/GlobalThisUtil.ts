import batteryInfo from '@ohos.batteryInfo';
import deviceInfo from '@ohos.deviceInfo';
import { PlayerPreference } from '../common/PlayerPref';

export function SetToGlobalThis(key: string, obj: unknown): void {
  globalThis[key] = obj;
}

export function GetFromGlobalThis(key: string) {
  return globalThis[key];
}

export function InitGlobalThisContext(data)
{
  globalThis.context = data;
  globalThis.context.batteryInfo = batteryInfo;
  globalThis.context.playerPrefs = PlayerPreference;
  globalThis.context.deviceInfo  = deviceInfo;
}

export function SetToGlobalThisContext(key, value) {
  globalThis.context[key] = value;
}

export function GetFromGlobalThisContext(key) {
  return globalThis.context[key];
}