import SwiftUI

struct UnityViewContainer: UIViewControllerRepresentable {

    func makeUIViewController(context: Context) -> UIViewController {
        let vc = UIViewController()

        UnityManager.shared.startUnity()

        if let unityView = UnityManager.shared.getUnityView() {
            unityView.frame = vc.view.bounds
            unityView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            vc.view.addSubview(unityView)
        }

        return vc
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {}
}