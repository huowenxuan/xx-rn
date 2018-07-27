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
        // vogue的url保存在text中，奇怪
        if ([plainStr containsString:@"https://"]) {
          [self upload: plainStr];
        }
        NSLog(@"text %@", plainStr);
      }];
    } else if([dataType isEqualToString:@"public.url"]){
      dispatch_group_enter(group);
      [provider loadItemForTypeIdentifier:dataType options:nil completionHandler:^(NSURL *url, NSError *error) {
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
  NSString *host = @"http://207.246.86.58";
  NSString *testHost = @"http://localhost:3000";
  
  // stringByAddingPercentEncodingWithAllowedCharacters 会自动转换这些
//  urlStr = [urlStr stringByReplacingOccurrencesOfString:@"#" withString:@"%23"];
//  urlStr = [urlStr stringByReplacingOccurrencesOfString:@"%" withString:@"%25"];
  urlStr = [urlStr stringByReplacingOccurrencesOfString:@"&" withString:@"%26"];
  urlStr = [urlStr stringByReplacingOccurrencesOfString:@"+" withString:@"%2B"];
  urlStr = [urlStr stringByReplacingOccurrencesOfString:@" " withString:@"%20"];
  urlStr = [urlStr stringByReplacingOccurrencesOfString:@"?" withString:@"%3F"];
  urlStr = [urlStr stringByReplacingOccurrencesOfString:@"=" withString:@"%3D"];
  urlStr = [NSString stringWithFormat:@"%@/api/vogue/start?url=%@", host, urlStr];
  
  NSLog(@"%@", urlStr);

  NSURL *url = [NSURL URLWithString: [urlStr stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]]];
  
  NSURLRequest *request = [NSURLRequest requestWithURL:url];
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
