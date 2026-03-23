//
//  UnityManager.m
//  StoryBox
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

// 1. O nome aqui TEM que ser UnityManager e herdar de NSObject
@interface RCT_EXTERN_MODULE(UnityViewManager, NSObject)

// 2. Exportamos o método exato que existe no seu arquivo Swift
RCT_EXTERN_METHOD(carregarUnity)

@end
