//
//  UnityViewManager.swift
//  StoryBox
//
//  Created by Alexandre on 23/03/26.
//

import Foundation
import UIKit
import React

@objc(UnityViewManager)
class UnityViewManager: RCTViewManager {
  
  @objc override static func moduleName() -> String! { "UnityView" }
  
  @objc override static func requiresMainQueueSetup() -> Bool { true }

  override func view() -> UIView! {
    // 1. Garantimos que a Unity está inicializada
    UnityManager.shared.carregarUnity()
    
    // 2. Tentamos pegar a view da Unity
    if let unityView = UnityManager.shared.pegarViewDaUnity() {
        // Recomenda-se remover a view do seu superview anterior caso ela já estivesse renderizada em outro lugar
        unityView.removeFromSuperview()
        return unityView
    }
    
    // 3. Fallback (A sua tela azul) caso a Unity falhe ou demore a carregar
    let fallbackView = UIView()
    fallbackView.backgroundColor = .blue
    
    let label = UILabel()
    label.text = "Carregando Unity..."
    label.textColor = .white
    label.translatesAutoresizingMaskIntoConstraints = false
    fallbackView.addSubview(label)
    
    NSLayoutConstraint.activate([
        label.centerXAnchor.constraint(equalTo: fallbackView.centerXAnchor),
        label.centerYAnchor.constraint(equalTo: fallbackView.centerYAnchor)
    ])
    
    return fallbackView
  }
}
