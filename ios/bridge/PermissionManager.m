//
//  NotificationEnabled.m
//  RNNotificationEnabled
//
//  Created by 霍文轩 on 17/3/3.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "PermissionManager.h"
#import <Photos/Photos.h>
#import <AssetsLibrary/AssetsLibrary.h>
#import <UserNotifications/UserNotifications.h>
#import "AppDelegate.h"
#import <CoreLocation/CoreLocation.h>

@implementation PermissionManager

RCT_EXPORT_MODULE()
RCT_EXPORT_METHOD(checkNotification: (RCTPromiseResolveBlock)resolve
									rejecter: (RCTPromiseRejectBlock)reject) {
	if ([[UIDevice currentDevice].systemVersion floatValue] >= 10.0) {
    [[UNUserNotificationCenter currentNotificationCenter] getNotificationSettingsWithCompletionHandler:^(UNNotificationSettings * _Nonnull settings) {
      if ([settings notificationCenterSetting] == UNNotificationSettingNotSupported) {
        // 未弹出过
        resolve(@"notSupport");
      } else if ([settings notificationCenterSetting] == UNNotificationSettingDisabled) {
        // 不允许
        resolve(@"disabled");
      } else if ([settings notificationCenterSetting] == UNNotificationSettingEnabled) {
        // 允许
        resolve(@"enabled");
      }
    }];
	} else	{
		if([[UIApplication sharedApplication] currentUserNotificationSettings].types == UIRemoteNotificationTypeNone) {
      resolve(@"disabled");
		} else {
      resolve(@"enabled");
		}
	}
}


RCT_EXPORT_METHOD(requestNotification: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject) {
}

RCT_EXPORT_METHOD(requestLocation: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject) {
  CLAuthorizationStatus status = [CLLocationManager authorizationStatus];
  CLLocationManager  *locationManager = [[CLLocationManager alloc] init];

  if (status == kCLAuthorizationStatusNotDetermined) {
    // 如果没有权限就直接请求，并且重新执行方法，而且CLLocationManager初始化不能写在这里，会重复创建，也就是会重复alert权限
    [locationManager requestWhenInUseAuthorization];
    [self requestLocation:resolve rejecter:reject];
  } else if (status == kCLAuthorizationStatusDenied) {
    resolve(@"denied");
  } else if (status == kCLAuthorizationStatusRestricted) {
    resolve(@"restricted");
  } else if (status == kCLAuthorizationStatusAuthorizedAlways) {
    resolve(@"authorized");
  } else if (status == kCLAuthorizationStatusAuthorizedWhenInUse) {
    resolve(@"authorized");
  }
}

RCT_EXPORT_METHOD(isPhotoUsageEnabled: (RCTPromiseResolveBlock)resolve
									rejecter: (RCTPromiseRejectBlock)reject) {
	if ([[UIDevice currentDevice].systemVersion floatValue] >= 8.0) {
		PHAuthorizationStatus authorStatus = [PHPhotoLibrary authorizationStatus];
		if (authorStatus == PHAuthorizationStatusDenied){
      resolve(@"denied");
		} else if (authorStatus == PHAuthorizationStatusAuthorized){
      resolve(@"authorized");
    } else if (authorStatus == PHAuthorizationStatusRestricted) {
      resolve(@"restricted");
    } else if (authorStatus == PHAuthorizationStatusNotDetermined) {
      resolve(@"notDetermined");
    }
	} else {
		ALAuthorizationStatus authorStatus = [ALAssetsLibrary authorizationStatus];
    if (authorStatus == ALAuthorizationStatusDenied){
      resolve(@"denied");
    } else if (authorStatus == ALAuthorizationStatusAuthorized){
      resolve(@"authorized");
    } else if (authorStatus == ALAuthorizationStatusRestricted) {
      resolve(@"restricted");
    } else if (authorStatus == ALAuthorizationStatusNotDetermined) {
      resolve(@"notDetermined");
    }
	}
}

RCT_EXPORT_METHOD(requestPhoto: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject) {
  [PHPhotoLibrary requestAuthorization:^(PHAuthorizationStatus authorStatus) {
    if (authorStatus == PHAuthorizationStatusDenied){ // 之前被拒绝
      resolve(@"denied");
    } else if (authorStatus == PHAuthorizationStatusAuthorized){
      resolve(@"authorized");
    } else if (authorStatus == PHAuthorizationStatusRestricted) {
      resolve(@"restricted");
    } else if (authorStatus == PHAuthorizationStatusNotDetermined) {
      resolve(@"notDetermined");
    }
  }];
}

RCT_EXPORT_METHOD(toSettingPage) {
  [[UIApplication sharedApplication] openURL:[NSURL URLWithString:UIApplicationOpenSettingsURLString]];
}

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}
@end
