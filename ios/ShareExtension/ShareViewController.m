//
//  ShareViewController.m
//  ShareExtension
//
//  Created by 霍文轩 on 2018/7/24.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "ShareViewController.h"
#import <MobileCoreServices/MobileCoreServices.h>
@interface ShareViewController ()
@property(assign, nonatomic) BOOL url;
@end

@implementation ShareViewController

/**
 * 验证用户输入
 */
- (BOOL)isContentValid {
    return YES;
}

/**
 * 提交
 */
- (void)didSelectPost {
  NSObject<OS_dispatch_group> *group = dispatch_group_create();
  NSArray<NSExtensionItem *> *itemArray = self.extensionContext.inputItems;
  NSExtensionItem *item = itemArray.firstObject;
  NSArray<NSItemProvider *> *providerArray = item.attachments;
  for(NSItemProvider *provider in providerArray){
    NSString *dataType = provider.registeredTypeIdentifiers.firstObject;
    if([dataType isEqualToString:@"public.image"]){
      [provider loadItemForTypeIdentifier:dataType options:nil completionHandler:^(UIImage *image, NSError *error) {
        NSLog(@"image %@", image);
      }];
      
    } else if([dataType isEqualToString:@"public.plain-text"]){
      [provider loadItemForTypeIdentifier:dataType options:nil completionHandler:^(NSString *plainStr, NSError *error) {
        if ([plainStr containsString:@"https://"]) {
          if (!self.url) {
            self.url = plainStr;
            [self upload: plainStr];
          }
        }
        NSLog(@"text %@", plainStr);
      }];
    } else if([dataType isEqualToString:@"public.url"]){
      dispatch_group_enter(group);
      [provider loadItemForTypeIdentifier:dataType options:nil completionHandler:^(NSURL *url, NSError *error) {
        if ([url.absoluteString containsString:@"https://"]) {
          if (!self.url) {
            self.url = url.absoluteString;
            [self upload: url.absoluteString];
          }
        }
        NSLog(@"url %@", url);
        dispatch_group_leave(group);
      }];
    }
  }
  
  dispatch_group_notify(group, dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_HIGH, 0), ^{
    [self.extensionContext completeRequestReturningItems:@[] completionHandler: nil];
  });
}

- (void)upload: (NSString *)urlStr {
  NSString *host = @"https://www.huowenxuan.top/api/vogue/start";
//  NSString *host = @"http://localhost:7001/api/vogue/start";
  
  NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString: host]];
  [request setHTTPMethod:@"POST"];

  NSString *parmStr = [NSString stringWithFormat:@"url=%@", urlStr];
  NSData *pramData = [parmStr dataUsingEncoding:NSUTF8StringEncoding];
  [request setHTTPBody:pramData];
  
  NSURLSession *session = [NSURLSession sharedSession];
  NSURLSessionDataTask *dataTask=[session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
    NSString *res = [[NSString alloc]initWithData:data encoding:NSUTF8StringEncoding];
    NSLog(@"%@", res);
  }];
  [dataTask resume];
}

- (NSArray *)configurationItems {
    return @[];
}

/**
 * 取消
 */
-(void)didSelectCancel {
}

@end
