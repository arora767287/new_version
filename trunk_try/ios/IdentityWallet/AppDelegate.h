#import <Foundation/Foundation.h>
#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import <FIRMessaging.h>

#import <Expo/Expo.h>

@interface AppDelegate : EXAppDelegateWrapper <RCTBridgeDelegate, FIRMessagingDelegate, UNUserNotificationCenterDelegate>
@property (nonatomic, assign) UIBackgroundTaskIdentifier taskIdentifier;

@end
