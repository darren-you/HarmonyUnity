import tuanjie from 'libtuanjie.so';
import { GetFromGlobalThis } from '../common/GlobalThisUtil';

export class DebuggerDialogInfo {
  public Title: string = ""
  public Message: string = ""
  public buttonText: string = "OK"
  public Showing: boolean;

  constructor(Title: string, Message: string, buttonText: string, Showing: boolean) {
    this.Title = Title
    this.Message = Message
    this.buttonText = buttonText
    this.Showing = Showing
  }

  static readonly DebuggerDialogInfoKey = "debuggerDialogInfo";

  static getDebuggerDialogInfo() {
    return GetFromGlobalThis(DebuggerDialogInfo.DebuggerDialogInfoKey);
  }

  static setDebuggerDialogInfo(dialogTitle: string, dialogMessage: string, dialogButtonText: string , dialogDisplay: boolean) {
    let debuggerDialogInfo:DebuggerDialogInfo = DebuggerDialogInfo.getDebuggerDialogInfo();
    debuggerDialogInfo.Title = dialogTitle
    debuggerDialogInfo.Message = dialogMessage
    debuggerDialogInfo.buttonText = dialogButtonText
    debuggerDialogInfo.Showing = dialogDisplay;
  }

}