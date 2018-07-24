'use strict'

import {
  NativeModules,
  PermissionsAndroid,
  Alert,
  Platform
} from 'react-native'
var PermissionManager = NativeModules.PermissionManager

export default class Permissions {
  // ios: notSupport disabled enabled
  // android: disabled enabled
  static checkNotification() {
    return PermissionManager.checkNotification()
  }

  static requestNotification() {
    if (Platform.OS === 'ios') {
      PermissionManager.requestNotification()
    }
  }

  static requestRecord() {
    return this.commonRequest(
      null,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      '录音',
      '同意授权，就可以使用语音回答了',
      ()=>Permissions.toRecordSettingPage()
    )
  }

  static toSettingPage() {
    PermissionManager.toSettingPage()
  }

  static toRecordSettingPage() {
    PermissionManager.toSettingPage()
  }

  static toSettingNotificationPage() {
    if (Platform.OS === 'ios') {
      PermissionManager.toSettingPage()
    } else {
      PermissionManager.toNotificationSettingPage()
    }
  }

  static toPhotoSettingPage() {
    PermissionManager.toSettingPage()
  }

  static async requestLocation() {
    return this.commonRequest(
      ()=>PermissionManager.requestLocation(),
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      '定位',
      '可以自动为你的话题添加地址',
      ()=>Permissions.toSettingPage()
    )
  }

  /* 请求相册权限、android外部存储权限 */
  static async requestPhotoAndExternalStorage() {
    return this.commonRequest(
      ()=>PermissionManager.requestPhoto(),
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      '外部存储',
      '同意授权，才可以访问外部文件',
      ()=>Permissions.toPhotoSettingPage()
    )
  }

  /**
   * @param iOSRequestAction：请求权限，并且把权限返回
   * @param androidRequestType
   * @param type
   * @param message
   * @param toSettingAction
   * @return {Promise<any>}
   */
  static async commonRequest(
    iOSRequestAction,
    androidRequestType,
    type,
    message,
    toSettingAction,
  ) {
    return new Promise(async (resolve, reject) => {
      let permission = null
      try {
        if (Platform.OS === 'ios') {
          permission = iOSRequestAction ? await iOSRequestAction() : 'authorized'
        } else {
          permission = await PermissionsAndroid.request(androidRequestType, {
            title: `鹿小圈申请${type}权限`,
            message
          })
          if (permission === PermissionsAndroid.RESULTS.GRANTED) {// 允许
            permission = 'granted'
          } else if (permission === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {// 不再询问
            permission = 'neverAskAgain'
          } else if (permission === PermissionsAndroid.RESULTS.DENIED) {// 禁止
            permission = 'denied'
          }
        }

        switch (permission) {
          case 'authorized':
          case 'granted':
            return resolve()
          case 'denied':
          case 'neverAskAgain':
          case 'restricted': // 家长控制
            return reject()
          case 'notDetermined':
            // iOS的从未询问过，该状态下不会走到这里
            return
        }
      } catch (e) {
        reject(e)
      }
    })
  }
}