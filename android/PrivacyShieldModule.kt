package com.yourapp

import android.app.Activity
import android.content.Context
import android.os.Build
import android.view.WindowManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class PrivacyShieldModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  override fun getName() = "RNPrivacyShieldNative"

  @ReactMethod
  fun enableAndroidSecureFlag() {
    currentActivity?.window?.addFlags(WindowManager.LayoutParams.FLAG_SECURE)
  }

  @ReactMethod
  fun disableAndroidSecureFlag() {
    currentActivity?.window?.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
  }

  @ReactMethod
  fun clearCookies() {
    android.webkit.CookieManager.getInstance().removeAllCookies(null)
    android.webkit.CookieManager.getInstance().flush()
  }

  @ReactMethod
  fun clearLocalStorage() {
    currentActivity?.getSharedPreferences("YourAppPrefs", Context.MODE_PRIVATE)?.edit()?.clear()?.apply()
  }

  @ReactMethod
  fun clearTrackingCache() {
    // Implement custom logic if you're using tracking libs
  }
}