import Foundation
import UIKit

@objc(RNPrivacyShieldNative)
class RNPrivacyShieldNative: NSObject {

  @objc
  func enableIOSScreenCapturePrevention() {
    DispatchQueue.main.async {
      UIApplication.shared.windows.first?.isHidden = false
      UIApplication.shared.isIdleTimerDisabled = true
      UIApplication.shared.windows.first?.layer.superlayer?.addSublayer(CALayer())
    }
  }

  @objc
  func disableIOSScreenCapturePrevention() {
    DispatchQueue.main.async {
      UIApplication.shared.isIdleTimerDisabled = false
    }
  }

  @objc
  func setMultitaskingPreviewRedacted(_ enabled: Bool) {
    DispatchQueue.main.async {
      UIApplication.shared.windows.first?.isHidden = false
      UIApplication.shared.windows.first?.layer.opacity = enabled ? 0.01 : 1.0
    }
  }

  @objc
  func clearCookies() {
    HTTPCookieStorage.shared.removeCookies(since: Date.distantPast)
  }

  @objc
  func clearLocalStorage() {
    UserDefaults.standard.removePersistentDomain(forName: Bundle.main.bundleIdentifier!)
    UserDefaults.standard.synchronize()
  }

  @objc
  func clearTrackingCache() {
    // Add 3rd-party SDK data clearing logic here
  }
}

@objc(RNPrivacyShieldNativeManager)
class RNPrivacyShieldNativeManager: RCTEventEmitter {
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}