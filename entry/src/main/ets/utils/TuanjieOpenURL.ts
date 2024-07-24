import common from '@ohos.app.ability.common';
import ability from '@ohos.ability.ability';
import { TuanjieLog } from '../common/TuanjieLog';
import uri from '@ohos.uri';

export class TuanjieOpenURL {

  static OpenURL(urlStr: string){
    let abilityContext = globalThis.AbilityContext;
    let context = abilityContext as common.UIAbilityContext;
    const url = new uri.URI(urlStr);
    let scheme = url.scheme == "null"? "":url.scheme+":";
    let userinfo = url.userInfo == "null"? "":url.userInfo+"@";
    let host = url.host=="null"? "":url.host;
    let path = url.path == "null"? "":url.path;
    let port = url.port == "-1"? "":":"+url.port;
    let query = url.query == "null"? "":"?" + url.query;
    let fragment = url.fragment=="null"? "":"#" + url.fragment;
    let result = `${scheme}//${userinfo}${url.host}${port}${path}${query}${fragment}`
    let wantInfo = {
      'action': 'ohos.want.action.viewData',
      'entities': ['entity.system.browsable'],
      'uri':result
    }
    context.startAbility(wantInfo).then(() => {
    }).catch((err) => {
      TuanjieLog.error("OpenURL failed, err: " + err);
    })
  }
}
