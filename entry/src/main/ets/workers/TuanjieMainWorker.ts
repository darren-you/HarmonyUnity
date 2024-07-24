import worker from '@ohos.worker';
import sensor from '@ohos.sensor'
import { Constants } from '../common/Constants';
import { TuanjieLog } from '../common/TuanjieLog';
import { TuanjiePermissions } from '../utils/TuanjiePermissions'
import { TuanjieLocation } from '../utils/TuanjieLocation'
import { WindowUtils } from '../utils/WindowUtils'
import { VideoPlayerProxy } from '../utils/VideoPlayerProxy'
import tuanjie from 'libtuanjie.so'
import vibrator from '@ohos.vibrator';
import common from '@ohos.app.ability.common';
import { TuanjieOpenURL } from '../utils/TuanjieOpenURL';
import display from '@ohos.display';
import { TuanjieAAID } from '../utils/TuanjieAAID';
import { TuanjieInternet } from '../utils/TuanjieInternet';
import { SystemSettings } from '../utils/SystemSettings';
import { PlayerPreference } from '../common/PlayerPref'

export class TuanjieMainWorker {
  public threadWorker: worker.ThreadWorker;
  public mModules = {
    "TuanjiePermissions": TuanjiePermissions,
    "TuanjieLocation": TuanjieLocation,
    "WindowUtils": WindowUtils,
    "TuanjieOpenURL": TuanjieOpenURL,
    "TuanjieAAID": TuanjieAAID,
    "SystemSettings": SystemSettings,
    "PlayerPreference": PlayerPreference,
    "TuanjieInternet": TuanjieInternet,
  };

  private constructor() {
    TuanjieLog.debug('%{public}s', 'TuanjieMainWorker.constructor');
    this.threadWorker = new worker.ThreadWorker("entry/ets/workers/TuanjieMainWorkerHandler.ts");
    this.threadWorker.onerror = function (e) {
      var msg = e.message;
      var filename = e.filename;
      var lineno = e.lineno;
      var colno = e.colno;
      TuanjieLog.error(`TuanjieMainWorker Error ${msg} ${filename} ${lineno} ${colno}`);
    }

    const self = this;
    this.threadWorker.onmessage = function (msg) {
      if (msg.data.type == "RUN_ON_UI_THREAD") {
        tuanjie.processUIThreadMessage();
      }
      if (msg.data.type == "RUN_ON_UI_THREAD_JS") {
        //TuanjieLog.info('%{public}s', 'RUN_ON_UI_THREAD_JS start！');

        if (!!msg.data.args) {
          self.dispatch(msg.data);
          return;
        }

        var funcName = msg.data.funcName;

        if (funcName == "ShowSoftInput") {
          var initialText = msg.data.initialText;

          globalThis.inputInitialText = initialText;
          //TuanjieLog.info('%{public}s', 'dialogController open start');
          globalThis.dialogController.open();
          //TuanjieLog.info('%{public}s', 'dialogController open finish');

          TuanjieLog.info(msg.data.funcName);
        }

        if (funcName == "RequestUserPermissions") {
          TuanjiePermissions.requestUserPermissions(msg.data.permissions, msg.data.onGranted, msg.data.onDenied);
        }

        if (funcName == "CheckPermission") {
          TuanjiePermissions.checkPermission(msg.data.permission, msg.data.onAuthorized, msg.data.onUnauthorized);
        }

        if (funcName == "LocationUpdates") {
          TuanjieLocation.requestLocationUpdates(msg.data.timeInterval, msg.data.distanceInterval, msg.data.accuracy);
        }

        if (funcName == "RemoveUpdates") {
          TuanjieLocation.removeUpdates();
        }

        if (funcName == "GetDeclination") {
          TuanjieLocation.getDeclination(msg.data.userData, msg.data.timeoutMs, msg.data.latitude, msg.data.longitude, msg.data.altitude, msg.data.timestamp);
        }

        if (funcName == "SetSystemBarState") {
          WindowUtils.setSystemBarState(msg.data.systemBars);
        }

        if (funcName == "SetOrientation") {
          WindowUtils.setOrientation(msg.data.orientation);
        }

        if (funcName == "EnableSensor") {
          self.enableSensor(msg.data.sensorType, msg.data.sensorRate);
        }

        if (funcName == "DisableSensor") {
          self.disableSensor(msg.data.sensorType);
        }

        if (funcName == "ResetSensor") {
          self.disableSensor(msg.data.sensorType);
          self.enableSensor(msg.data.sensorType, msg.data.sensorRate);
        }

        if (funcName == "Vibrate") {
          var vibrateMs = msg.data.time;
          try {
            vibrator.startVibration({
              type: 'time',
              duration: vibrateMs,
            }, {
              id: 0,
              usage: 'alarm'
            }, (error) => {
              if (error) {
                console.error('Vibrate fail, error.code: ' + error.code + 'error.message: ', +error.message);
                return;
              }
              console.log('Callback returned to indicate a successful vibration.');
            });
          } catch (err) {
            console.error('errCode: ' + err.code + ' ,msg: ' + err.message);
          }

          TuanjieLog.info(msg.data.funcName);
        }

        if (funcName == "ShowVideoPlayer") {
          VideoPlayerProxy.ShowVideoPlayer(msg.data.path, msg.data.backgroundColor, msg.data.controlMode, msg.data.scalingMode);
        }

        if (funcName == "SetScreenOn"){
          WindowUtils.setScreenOn(msg.data.timeValue);
        }
        
        // webview
        if (funcName == "CreateWebView") {
          globalThis.webviewInfo.occupyble = true;
        }

        if (funcName == "RemoveWebview") {
          globalThis.webviewInfo.reset();
        }

        if (funcName == "LoadURL") {
          globalThis.webviewInfo.url = msg.data.url;
          globalThis.webviewInfo.controller.loadUrl(msg.data.url);
        }

        if (funcName == "LoadHTMLString") {
          globalThis.webviewInfo.controller.loadData(msg.data.contents, "text/html", "UTF-8", msg.data.baseUrl);
        }

        if (funcName == "LoadData") {
          globalThis.webviewInfo.controller.loadData(msg.data.contents, "text/html", "UTF-8", msg.data.baseUrl);
        }

        if (funcName == "EvaluateJS") {
          try {
            globalThis.webviewInfo.controller.runJavaScript(msg.data.jsContents).then((result) => {
              if (result) {
                this.webResult = result
                console.info(`The return value is: ${result}`)
              }
            })
          } catch (error) {
            console.error('Failed to evaluate JavaScript. Cause: ' + JSON.stringify(error));
          }
        }

        if (funcName == "SetVisibility") {
          globalThis.webviewInfo.visible = msg.data.visible;
        }

        if (funcName == "SetMargins") {
          let viewInfo = globalThis.webviewInfo;
          viewInfo.x = msg.data.ml;
          viewInfo.y = msg.data.mt;
          let w = display.getDefaultDisplaySync().width - msg.data.ml - msg.data.mr;
          let h = display.getDefaultDisplaySync().height - msg.data.mt - msg.data.mb;
          viewInfo.w = w;
          viewInfo.h = h;
        }

        if (funcName == "Reload") {
          globalThis.webviewInfo.controller.refresh();
        }

        if (funcName == "StopLoading") {
          globalThis.webviewInfo.controller.stop();
        }

        if (funcName == "GoForward") {
          if (globalThis.webviewInfo.controller.accessForward()) {
            globalThis.webviewInfo.controller.forward()
          }
        }

        if (funcName == "GoBack") {
          if (globalThis.webviewInfo.controller.accessBackward()) {
            globalThis.webviewInfo.controller.backward()
          }
        }

      }
    }
  }

  private enableSensor(sensorType, sensorRate) {
    try {
      const self = this;
      sensor.on(sensorType, function (data) {
        //TuanjieLog.info('------sensor sensorType: ' + sensorType + ', x: ' + data.x + ', y: ' + data.y + ', z: ' + data.z);

        let sensorData = {
          type: sensorType
        };
        self.extractSensorDatas(sensorData, data);
        TuanjieMainWorker.getInstance().postMessage({ type: 'OnSensor', data: sensorData });
      }, { interval: sensorRate });
    } catch (err) {
      console.error('------sensor.on fail, errCode: ' + err.code + ', msg: ' + err.message + ', type: ' + sensorType);
    }
  }

  private disableSensor(sensorType) {
    try {
      sensor.off(sensorType);
    } catch (err) {
      console.error('------sensor.off fail, errCode: ' + err.code + ' ,msg: ' + err.message);
    }
  }

  private extractSensorDatas(sensorData, originData) {
    sensorData.timestamp = originData.timestamp;
    switch (sensorData.type) {
      case sensor.SensorId.ACCELEROMETER:
      case sensor.SensorId.GRAVITY:
      case sensor.SensorId.GYROSCOPE:
      case sensor.SensorId.LINEAR_ACCELEROMETER:
      case sensor.SensorId.ROTATION_VECTOR:
        sensorData.datas = [originData.x, originData.y, originData.z];
        break;
    }
  }

  private async dispatch(data) {
    const tokens = data.funcName.split(".");
    const mod = this.mModules[tokens[0]];
    if (!!mod) {
      const func = mod[tokens[1]];
      if (!!func) {
        if (data.timeoutMs >= 0) { // async
          let timeout = new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error("Async call timeout"));
            }, data.timeoutMs);
          });
          let succ = func(...data.args);
          Promise.race([succ, timeout]).then((result) => {
            tuanjie.nativeInvokeJSResult(true, data.userData, result);
          }).catch((reason) => {
            tuanjie.nativeInvokeJSResult(false, data.userData, reason);
          });
        } else { // data.timeoutMs < 0, sync
          try {
            let result = func(...data.args);
            tuanjie.nativeInvokeJSResult(true, data.userData, result);
          } catch (err) {
            let errMsg = JSON.stringify(err) ?? "unknown error";
            errMsg = "Error calling " + data.funcName + "err=" + errMsg;
            TuanjieLog.error('%{public}s', errMsg);
            tuanjie.nativeInvokeJSResult(false, data.userData, errMsg);
          }
        }
      } else {
          TuanjieLog.error('%{public}s', "No funcname with name=" + data.funcName);
          tuanjie.nativeInvokeJSResult(false, data.userData, "No funcname with name=" + data.funcName);
      }
    } else {
      TuanjieLog.error('%{public}s', "No module with name=" + tokens[0]);
      tuanjie.nativeInvokeJSResult(false, data.userData, "No module with name=" + tokens[0]);
    }
  }

  public static getInstance(): worker.ThreadWorker {
    if (AppStorage.Get(Constants.APP_KEY_TUANJIE_MAIN_WORKER) == null) {
      AppStorage.setOrCreate(Constants.APP_KEY_TUANJIE_MAIN_WORKER, new TuanjieMainWorker);
    }
    var tuanjieMainWorker = AppStorage.Get(Constants.APP_KEY_TUANJIE_MAIN_WORKER) as TuanjieMainWorker;
    return tuanjieMainWorker.threadWorker;
  }
}
