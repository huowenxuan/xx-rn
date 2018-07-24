//
//  UtilsManager.m
//  turbo
//
//  Created by 霍文轩 on 2018/3/5.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "UtilsManager.h"
#import <Photos/Photos.h>
#import <SafariServices/SafariServices.h>

@implementation UtilsManager

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(savePhoto: (NSString *)base64
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject) {
  NSData *data = [[NSData alloc] initWithBase64EncodedString:base64 options:NSDataBase64DecodingIgnoreUnknownCharacters];
  [[PHPhotoLibrary sharedPhotoLibrary] performChanges:^{
    [PHAssetChangeRequest creationRequestForAssetFromImage:[UIImage imageWithData:data]];
  } completionHandler:^(BOOL success, NSError * _Nullable error) {
    if (error) {
      long code = error.code;
      NSString *description = error.localizedDescription;
      NSString *domain = error.domain;
      reject(@(code).description, description, error);
    } else {
      resolve(NULL);
    }
  }];
}

RCT_EXPORT_METHOD(showSafari: (NSString *)url) {
  SFSafariViewController * sfController = [[SFSafariViewController alloc] initWithURL:[NSURL URLWithString:url]];
  dispatch_async(dispatch_get_main_queue(), ^{
    [[[[UIApplication sharedApplication] keyWindow] rootViewController] presentViewController:sfController animated:YES completion:nil];
  });
 }

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

@end
