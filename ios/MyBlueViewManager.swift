//
//  MyBlueViewManager.swift
//  StoryBox
//
//  Created by Alexandre on 23/03/26.
//

import Foundation
import UIKit
import React

@objc(MyBlueViewManager)
class MyBlueViewManager: RCTViewManager {
  
  @objc override static func moduleName() -> String! { "MyBlueView" }
  
  @objc override static func requiresMainQueueSetup() -> Bool { true }

  override func view() -> UIView! {
    let blueView = UIView()
    blueView.backgroundColor = .blue
    return blueView
  }
}
