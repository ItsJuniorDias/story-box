#if canImport(UnityFramework)
import Foundation
import UIKit
import UnityFramework
import MachO

@objc(UnityView)
class UnityView: UIView {

    var ufw: UnityFramework?

    override init(frame: CGRect) {
        super.init(frame: frame)
        initUnity()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        initUnity()
    }

    func initUnity() {

        guard let bundlePath = Bundle.main.path(forResource: "UnityFramework", ofType: "framework") else {
            print("UnityFramework não encontrado")
            return
        }

        let bundle = Bundle(path: bundlePath)
        bundle?.load()

        ufw = bundle?.principalClass?.getInstance()

        if ufw?.appController() == nil {

            var header = _mh_execute_header

            withUnsafePointer(to: &header) {
                ufw?.setExecuteHeader($0)
            }

            ufw?.runEmbedded(withArgc: CommandLine.argc,
                             argv: CommandLine.unsafeArgv,
                             appLaunchOpts: nil)
        }

        if let unityView = ufw?.appController()?.rootView {
            unityView.frame = bounds
            addSubview(unityView)
        }
    }
}
#else
import UIKit
@objc(UnityView)
class UnityView: UIView {
    override init(frame: CGRect) {
        super.init(frame: frame)
        #if DEBUG
        print("UnityFramework not available: running stub UnityView")
        #endif
        backgroundColor = .black
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        #if DEBUG
        print("UnityFramework not available: running stub UnityView")
        #endif
        backgroundColor = .black
    }
}
#endif

