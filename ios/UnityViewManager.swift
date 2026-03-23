//
//  UnityViewManager.swift
//  StoryBox
//
//  Created by Alexandre on 23/03/26.
//

import Foundation
import React

@objc(UnityViewManager)
class UnityViewManager: RCTViewManager {

  override func view() -> UIView! {
    return UnityView()
  }

  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
