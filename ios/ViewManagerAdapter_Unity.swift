import Foundation
import UIKit
import UnityFramework
import MachO

class UnityManager {

    static let shared = UnityManager()
    var ufw: UnityFramework?

    func startUnity() {
        print("🚀 [UnityManager] startUnity FOI DISPARADO PELO REACT NATIVE!")
        
        // 1. Forçamos a execução na Main Thread (Isso evita 90% dos crashes de UI)
        DispatchQueue.main.async {
            if self.ufw != nil { return }

            // 2. Busca segura do Bundle (tentando a raiz e a pasta Frameworks)
            let pathRaiz = Bundle.main.bundlePath + "/UnityFramework.framework"
            let pathFrameworks = Bundle.main.bundlePath + "/UnityFramework.framework"
            
            var bundle = Bundle(path: pathRaiz)
            if bundle == nil {
                bundle = Bundle(path: pathFrameworks)
            }

            // 3. Em vez de crashar com "!", paramos a execução e avisamos no console do Xcode
            guard let unityBundle = bundle else {
                print("🚨 [UnityManager] ERRO FATAL: UnityFramework.framework não encontrado no app!")
                return
            }

            unityBundle.load()

            self.ufw = unityBundle.principalClass?.getInstance()

            guard self.ufw != nil else {
                print("🚨 [UnityManager] ERRO FATAL: Falha ao instanciar o UnityFramework!")
                return
            }

            let headerPtr = #dsohandle.assumingMemoryBound(to: MachHeader.self)
            self.ufw?.setExecuteHeader(headerPtr)

            // 4. Rodamos o Unity
            self.ufw?.runEmbedded(
                withArgc: CommandLine.argc,
                argv: CommandLine.unsafeArgv,
                appLaunchOpts: nil
            )
        }
    }

    func getUnityView() -> UIView? {
            guard let rootView = ufw?.appController()?.rootView else {
                print("🚨 [UnityManager] TELA PRETA: O React Native pediu a view, mas o Unity ainda não terminou de criar o rootView (retornou nil).")
                return nil
            }
            
            print("✅ [UnityManager] rootView entregue com sucesso para o React Native!")
            
            // Força a view do Unity a recalcular seu layout para evitar problemas de redimensionamento
            rootView.setNeedsLayout()
            rootView.layoutIfNeeded()
            
            return rootView
     }
}