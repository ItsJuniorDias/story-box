//
//  UnityManager.swift
//  StoryBox
//
//  Created by Alexandre on 23/03/26.
//

import Foundation
import UIKit
// Importante: Você precisará expor o UnityFramework no seu Bridging Header
import UnityFramework

class UnityManager: UIResponder, UIApplicationDelegate {
    
    static let shared = UnityManager()
    
    private var unityFramework: UnityFramework?
    
    func carregarUnity() {
        if isUnityRodando() { return }
        
        let bundlePath = Bundle.main.bundlePath + "/UnityFramework.framework"
        guard let bundle = Bundle(path: bundlePath) else {
            print("Erro: UnityFramework não encontrado")
            return
        }
        
        if !bundle.isLoaded {
            bundle.load()
        }
        
        guard let ufw = bundle.principalClass?.getInstance() else {
            print("Erro: Não foi possível instanciar o UnityFramework")
            return
        }
        
        self.unityFramework = ufw
        self.unityFramework?.setDataBundleId("com.unity3d.framework")
        
        // Passa os argumentos de inicialização da linha de comando (vazio por padrão)
      // Substitua o mapeamento de argumentos e o runUIApplicationMainOrInit pelo runEmbedded:
      self.unityFramework?.runEmbedded(
          withArgc: CommandLine.argc,
          argv: CommandLine.unsafeArgv,
          appLaunchOpts: nil
      )
    }
    
    func isUnityRodando() -> Bool {
        return unityFramework != nil && unityFramework?.appController() != nil
    }
    
    func pegarViewDaUnity() -> UIView? {
        // A Unity renderiza tudo na rootView do appController dela
        return unityFramework?.appController()?.rootView
    }
}
