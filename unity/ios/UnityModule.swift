import ExpoModulesCore

public class UnityModule: Module {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module.
    // The module will be accessible from `requireNativeModule('Unity')` in JavaScript.
    Name("Unity")

    // Defines constant property on the module.
    Constant("PI") {
      Double.pi
    }

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      return "Hello world! 👋"
    }

    // Defines a JavaScript function that always returns a Promise
    AsyncFunction("setValueAsync") { (value: String) in
      // Send an event to JavaScript.
      self.sendEvent("onChange", [
        "value": value
      ])
    }

    // Enables the module to be used as a native view.
    View(UnityView.self) {
      // ❌ REMOVED: The boilerplate "url" Prop that caused the `webView` build failure.
      
      // ✅ You can add custom Unity props here later. For example:
      // Prop("someConfiguration") { (view: UnityView, config: String) in
      //    // Pass configuration to your Unity instance
      // }

      // You can keep this if you plan to send an `onLoad` event back to React Native 
      // when Unity finishes initializing.
      Events("onLoad")
    }
  }
}