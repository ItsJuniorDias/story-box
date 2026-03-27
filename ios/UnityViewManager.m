#import "UnityViewManager.h"
#import <mach-o/dyld.h>

@implementation UnityViewManager

// 1. A MÁGICA ACONTECE AQUI:
// Essa macro registra automaticamente a classe no React Native quando o app inicia.
// Você pode passar um nome (ex: RCT_EXPORT_MODULE(UnityView)) ou deixar vazio para usar o nome da classe.
RCT_EXPORT_MODULE(UnityView)

// 2. MÉTODO OBRIGATÓRIO:
// O React Native chama esse método para saber qual View nativa ele deve desenhar na tela.
- (UIView *)view {
    // Aqui você deve inicializar e retornar a view real do Unity.
    // Como exemplo estático:
    UIView *unityView = [[UIView alloc] init];
    return unityView;
}

// Seu método original corrigido
+ (const void *)getMachHeader {
    return _dyld_get_image_header(0);
}

@end
