//
//  UnityManager.swift
//  StoryBox
//

import Foundation
import UIKit
import UnityFramework
import MachO


class UnityManager: UIResponder {

    static let shared = UnityManager()

    private var unityFramework: UnityFramework?

    // MARK: - Carregar Unity
    func carregarUnity() {

        if isUnityRodando() { return }

        guard let unityFramework = loadUnityFramework() else {
            print("❌ Não foi possível carregar UnityFramework")
            return
        }

        self.unityFramework = unityFramework
        unityFramework.setDataBundleId("com.unity3d.framework")

        // Necessário para iOS Embedded Unity
        if unityFramework.appController() == nil {
            
            // 🔥 SOLUÇÃO DEFINITIVA: Puxando o header do Objective-C
            let headerPtr = UnityViewManager.getMachHeader()
            let machHeader = UnsafeRawPointer(headerPtr!).assumingMemoryBound(to: MachHeader.self)
          
            unityFramework.setExecuteHeader(machHeader)
        }

        print("🚀 Iniciando Unity...")

        unityFramework.runEmbedded(
            withArgc: CommandLine.argc,
            argv: CommandLine.unsafeArgv,
            appLaunchOpts: nil
        )
    }

    // MARK: - Carregar Framework
    private func loadUnityFramework() -> UnityFramework? {
        
        // Caminho padrão onde o Unity coloca o framework no build de iOS
        let bundlePath = Bundle.main.bundlePath + "/UnityFramework.framework"

        guard let bundle = Bundle(path: bundlePath) else {
            print("❌ Bundle UnityFramework não encontrado")
            return nil
        }

        if !bundle.isLoaded {
            bundle.load()
        }

        guard let ufwClass = bundle.principalClass as? UnityFramework.Type else {
            print("❌ Classe UnityFramework não encontrada")
            return nil
        }

        return ufwClass.getInstance()
    }

    // MARK: - Status
    func isUnityRodando() -> Bool {
        return unityFramework?.appController() != nil
    }

    // MARK: - View da Unity
    func pegarViewDaUnity() -> UIView? {
        return unityFramework?.appController()?.rootView
    }

    // MARK: - Pausar / Retomar / Encerrar
    func pausarUnity() {
        unityFramework?.pause(true)
    }

    func resumirUnity() {
        unityFramework?.pause(false)
    }

    func unloadUnity() {
        unityFramework?.unloadApplication()
        unityFramework = nil
    }
}
