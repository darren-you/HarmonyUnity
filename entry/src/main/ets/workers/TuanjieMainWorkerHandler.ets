import worker from '@ohos.worker';
import bundleManager from '@ohos.bundle.bundleManager';
import tuanjie from 'libtuanjie.so';
import { TuanjieLog } from '../common/TuanjieLog';
import { registerJSScriptToCSharp } from '../common/TuanjieJSScriptRegister';
import { InitGlobalThisContext,SetToGlobalThisContext,SetToGlobalThis } from '../common/GlobalThisUtil';
import geoLocationManager from '@ohos.geoLocationManager';
import { TuanjieDisplayInfo } from '../utils/DisplayInfoManager';

interface Location {
  latitude:number,
  longitude:number,
  altitude:number,
  accuracy:number,
  speed:number,
  timeStamp:number,
  direction:number,
  timeSinceBoot:number,
}

TuanjieLog.debug("tuanjie.nativeSetWorker");
tuanjie.nativeSetWorker();

const workerPort = worker.workerPort
// This line makes workerPort available for native code
// not sure why, maybe compiler will optimize `const`
//globalThis.workerPort = workerPort;
SetToGlobalThis("workerPort",workerPort);

workerPort.onmessage = (e)=> {
  let data :ESObject = e.data;
  switch (data.type) {
    case 'SetGlobalThisContext':
      InitGlobalThisContext(data.data);
      SetToGlobalThisContext("tuanjieJSScript",registerJSScriptToCSharp());
      bundleManager.getBundleInfoForSelf(bundleManager.BundleFlag.GET_BUNDLE_INFO_DEFAULT).then((data) => {
        SetToGlobalThisContext("bundleInfo",data);
      });
      break;
    case 'Loop':
      console.log("message from main thread received!");
    //tuanjie.nativeDebugLoop();
      break;
    case 'SetDisplayInfo':
      let  defaultDisplay : TuanjieDisplayInfo = data.data;
      SetToGlobalThis('defaultDisplay', defaultDisplay);
      tuanjie.nativeOnDisplayChanged();
      break;
    case 'SoftInput_onTextChange':
      SetToGlobalThis("softInputMsg",data.data);
      TuanjieLog.debug("CustomDialogController worker thread SoftInput_onTextChange " + data.data);
      tuanjie.nativeSetInputString();
      break;
    case 'SoftInput_onTextSelectionChange':
      tuanjie.nativeSetInputSelection(data.start, data.length);
      break;
    case 'SoftInput_accept':
      TuanjieLog.debug("CustomDialogController worker thread SoftInput_accept " + data.data);
      tuanjie.nativeSoftInputClosed();
      break;
    case 'SoftInput_cancel':
    // todo call tuanjie native api
      break;
    case 'OnSensor':
      tuanjie.nativeOnSensorChanged(data.data);
      break;
    case 'GetPermissionRequestResult':
      tuanjie.nativeGetPermissionRequestResult(data.permissions, data.results, data.onGranted, data.onDenied);
      break;
    case 'GetPermissionAuthorizeResult':
      tuanjie.nativeGetPermissionAuthorizeResult(data.permission, data.result, data.onAuthorized, data.onUnauthorized);
      break;
    case 'OnLocation':
      let locationData :geoLocationManager.Location = data.location;
      let location : Location = {latitude:0,longitude:0,altitude:0,accuracy:0,speed:0,timeStamp:0,direction:0,timeSinceBoot:0};//default value
      location.latitude = locationData.latitude;
      location.longitude = locationData.longitude;
      location.altitude = locationData.altitude;
      location.accuracy = locationData.accuracy;
      location.speed = locationData.speed;
      location.timeStamp = locationData.timeStamp;
      location.direction = locationData.direction;
      location.timeSinceBoot = locationData.timeSinceBoot;
      tuanjie.nativeOnLocationChange(location);
      break;
    default:
      TuanjieLog.error("TuanjieMainWorkerHandler: '%{public}s' unknown message", data.type);
  }
}
