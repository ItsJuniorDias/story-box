//
//  UnityViewManager.swift
//  StoryBox
//
//  Created by Alexandre on 22/03/26.
//

import Foundation
import React
import UIKit

@objc(UnityViewManager)
class UnityViewManager: RCTViewManager {

  override static func requiresMainQueueSetup() -> Bool {
    return true
  }

  override func view() -> UIView! {
    UnityManager.shared.startUnity()
    return UnityManager.shared.getUnityView()
  }
}
