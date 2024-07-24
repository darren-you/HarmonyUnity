import { TuanjieLog } from '../common/TuanjieLog';
import promptAction from '@ohos.promptAction';
import { DebuggerDialogInfo } from '../utils/DebuggerDialogInfo'
import { SetToGlobalThis } from '../common/GlobalThisUtil';
import tuanjie from 'libtuanjie.so'
@Component
export struct DebuggerDialog {
  @Link debuggerDialogInfo: DebuggerDialogInfo;

  build() {}

  aboutToAppear()
  {
      promptAction.showDialog({
      title: this.debuggerDialogInfo.Title,
      message: this.debuggerDialogInfo.Message,
      buttons: [
        {
          text: this.debuggerDialogInfo.buttonText,
          color: "#000000"
        }
      ]
    }).then( data => {
        tuanjie.nativeDebuggerDialogClosed();
        this.debuggerDialogInfo.Showing = false;
      });
  }
};