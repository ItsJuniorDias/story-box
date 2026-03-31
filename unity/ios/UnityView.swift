import UIKit
import ExpoModulesCore
import MachO

#if arch(x86_64) || arch(arm64)
typealias MachHeader = mach_header_64
#else
typealias MachHeader = mach_header
#endif

// Precisamos carregar o bundle dinamicamente porque o UnityFramework 
// é injetado em tempo de compilação pelo Podfile do app principal.
class UnityView: ExpoView {
  private var unityFramework: UnityFramework?
  
  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    self.clipsToBounds = true
    
    initUnity()
  }
  
  private func initUnity() {
    // 1. Encontra e carrega o UnityFramework no Bundle do App
    let bundlePath = Bundle.main.bundlePath + "/UnityFramework.framework"
    guard let bundle = Bundle(path: bundlePath) else {
      print("Erro: UnityFramework.framework não encontrado no Bundle.")
      return
    }
    
    if !bundle.isLoaded {
      bundle.load()
    }
    
    // 2. Instancia o Framework
    guard let principalClass = bundle.principalClass as? UnityFramework.Type else { return }
    let ufw = principalClass.getInstance()
    self.unityFramework = ufw
    
    // 3. Inicializa a engine da Unity (se já não estiver rodando)
    if ufw?.appController() == nil {
      // Fix para Xcode 16+: Usa #dsohandle em vez de _mh_execute_header
      let header = #dsohandle.assumingMemoryBound(to: MachHeader.self)
      ufw?.setExecuteHeader(header)
      
      ufw?.setDataBundleId("com.unity3d.framework")
      
      // Roda a Unity embutida
      ufw?.runEmbedded(withArgc: CommandLine.argc, argv: CommandLine.unsafeArgv, appLaunchOpts: nil)
    }
    
    // 4. Captura a View da Unity e adiciona na nossa ExpoView
    if let uView = ufw?.appController()?.rootView {
      self.addSubview(uView)
      uView.frame = self.bounds
      uView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    }
  }
}

// 5. NOVO PROTOCOLO: Ensina o Swift que o AppController da Unity tem uma rootView
@objc protocol UnityAppController: UIApplicationDelegate {
  var rootView: UIView? { get }
}

// Declaração do protocolo para que o Swift reconheça os métodos do UnityFramework
// sem precisar importar o header C++ diretamente no módulo.
@objc protocol UnityFramework {
  static func getInstance() -> UnityFramework?
  
  // 6. ATUALIZADO: Retorna o nosso novo UnityAppController em vez de UIApplicationDelegate
  func appController() -> UnityAppController?
  
  func setExecuteHeader(_ header: UnsafePointer<MachHeader>?)
  func setDataBundleId(_ bundleId: String)
  func runEmbedded(withArgc argc: Int32, argv: UnsafeMutablePointer<UnsafeMutablePointer<Int8>?>?, appLaunchOpts: [AnyHashable: Any]?)
}