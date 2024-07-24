import geoLocationManager from '@ohos.geoLocationManager';
import { TuanjieLog } from '../common/TuanjieLog';
import sensor from '@ohos.sensor'
import { TuanjieMainWorker } from '../workers/TuanjieMainWorker';
import { PromiseWithTimeout } from './PromiseWithTimeout'
import { SyncCallHelper } from './SyncCallHelper'

export class TuanjieLocation {
  static requestLocationUpdates(timeInterval: number, distanceInterval: number, accuracy: number) {
    let requestInfo:geoLocationManager.LocationRequest = {'priority': geoLocationManager.LocationRequestPriority.FIRST_FIX, 'scenario': geoLocationManager.LocationRequestScenario.UNSET,
      'timeInterval': timeInterval, 'distanceInterval': distanceInterval, 'maxAccuracy': accuracy};

    let locationChange = (location: geoLocationManager.Location):void => {
      TuanjieLog.info('Update Location. Data: %{public}s',
        JSON.stringify(location) ?? '');
      TuanjieMainWorker.getInstance().postMessage({
        type: 'OnLocation',
        location: location
      });
    };

    try {
      geoLocationManager.on('locationChange', requestInfo, locationChange);
    } catch (err) {
      TuanjieLog.error('Update Location Failed. Error: %{public}s',
        JSON.stringify(err) ?? '');
    }
  }

  static removeUpdates() {
    try {
      geoLocationManager.off('locationChange');
    } catch (err) {
      TuanjieLog.error('Remove Updates Failed. Error: %{public}s',
        JSON.stringify(err) ?? '');
    }
  }

  static getDeclination(userData: number, timeoutMs: number, latitude: number, longitude: number, altitude: number, timestamp: number) {
    let geoInfo = sensor.getGeomagneticInfo({ latitude: latitude, longitude: longitude, altitude: altitude }, timestamp);
    let transformFunc = (info): number => {
      return info.deflectionAngle;
    }
    let promiseHelper: PromiseWithTimeout = new PromiseWithTimeout(userData, timeoutMs);
    promiseHelper.executePromise(geoInfo, transformFunc);
  }

  static getLastKnownLocation() {
    let loc = geoLocationManager.getLastLocation();
    return [
      loc.latitude,
      loc.longitude,
      loc.altitude,
      loc.accuracy,
      loc.speed,
      loc.timeStamp,
      loc.direction,
      loc.timeSinceBoot,
      ];
  }
}