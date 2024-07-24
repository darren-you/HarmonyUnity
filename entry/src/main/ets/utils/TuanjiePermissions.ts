import abilityAccessCtrl, { Permissions } from '@ohos.abilityAccessCtrl';
import { TuanjieLog } from '../common/TuanjieLog';
import bundleManager from '@ohos.bundle.bundleManager';
import { PromiseWithTimeout } from './PromiseWithTimeout';
import { TuanjieMainWorker } from '../workers/TuanjieMainWorker';

// Matches enum in PermissionCallback.h
class PermissionResult {
  static readonly Success: number = 0;
  static readonly Failed: number = 1;
  static readonly Error: number = 2;
}

export class TuanjiePermissions {
  static requestUserPermissions(permissionsStr: Array<string>, onGranted: number, onDenied: number): void {
    TuanjieLog.info('requestUserPermissions enter.');
    const atManager = abilityAccessCtrl.createAtManager();
    let context = globalThis.AbilityContext;

    let permissions: Array<Permissions> = [];
    permissionsStr.forEach(element => {
      permissions.push(element as Permissions);
    });

    let permissionsSize: number = permissions.length;
    let permissionResults: Array<number> = new Array(permissionsSize);
    permissionResults.fill(PermissionResult.Error);

    atManager.requestPermissionsFromUser(context, permissions, (err, data) => {
      if (err) {
        TuanjieLog.error('Failed to requestPermission. Cause: %{public}s',
          JSON.stringify(err) ?? '');
      } else {
        TuanjieLog.info('Succeeded in requestPermission. Data: %{public}s',
          JSON.stringify(data) ?? '');
        for (let i = 0; i < permissionsSize; i++) {
          if (data.authResults[i] == 0)
            permissionResults[i] = PermissionResult.Success;
          else
            permissionResults[i] = PermissionResult.Failed;
        }
      }
      TuanjieMainWorker.getInstance().postMessage({
        type: 'GetPermissionRequestResult',
        permissions: data.permissions,
        results: permissionResults,
        onGranted: onGranted,
        onDenied: onDenied
      });
    })
  }

  static async checkAccessToken(permission: Permissions): Promise<abilityAccessCtrl.GrantStatus> {
    let atManager = abilityAccessCtrl.createAtManager();
    let grantStatus: abilityAccessCtrl.GrantStatus;

    // Obtain the access token ID of the application.
    let tokenId: number;
    try {
      let bundleInfo: bundleManager.BundleInfo = await bundleManager.getBundleInfoForSelf(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION);
      let appInfo: bundleManager.ApplicationInfo = bundleInfo.appInfo;
      tokenId = appInfo.accessTokenId;
    } catch (err) {
      TuanjieLog.error('Failed to getBundleInfoForSelf. Cause: %{public}s',
        JSON.stringify(err) ?? '');
    }

    // Check whether the user has granted the permission.
    try {
      grantStatus = await atManager.checkAccessToken(tokenId, permission);
    } catch (err) {
      TuanjieLog.error('Failed to checkAccessToken. Cause: %{public}s',
        JSON.stringify(err) ?? '');
    }

    return grantStatus;
  }

  static async hasPermission(permissionsStr: string): Promise<boolean> {
    let permission = permissionsStr as Permissions;
    let grantStatus = await TuanjiePermissions.checkAccessToken(permission);
    return grantStatus === abilityAccessCtrl.GrantStatus.PERMISSION_GRANTED;
  }

  static async checkPermission(permissionsStr: string, onAuthorized: number, onUnauthorized: number): Promise<void> {
    let permission = permissionsStr as Permissions;
    let checkResult = PermissionResult.Error;
    try {
      let grantStatus: abilityAccessCtrl.GrantStatus = await TuanjiePermissions.checkAccessToken(permission);
      if (grantStatus === abilityAccessCtrl.GrantStatus.PERMISSION_GRANTED)
        checkResult = PermissionResult.Success;
      else
        checkResult = PermissionResult.Failed;
    }
    catch (err) {
      TuanjieLog.error('Failed to checkPermission. Cause: %{public}s',
        JSON.stringify(err) ?? '');
    }
    finally {
      TuanjieMainWorker.getInstance().postMessage({
        type: 'GetPermissionAuthorizeResult',
        permission: permission,
        result: checkResult,
        onAuthorized: onAuthorized,
        onUnauthorized: onUnauthorized
      });
    }
  }
}