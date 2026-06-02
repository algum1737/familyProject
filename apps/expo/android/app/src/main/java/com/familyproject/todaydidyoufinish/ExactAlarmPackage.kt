package com.familyproject.todaydidyoufinish

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class ExactAlarmPackage : ReactPackage {
  @Deprecated("Required by the ReactPackage interface used by this app template.")
  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> =
    listOf(ExactAlarmModule(reactContext))

  override fun createViewManagers(
    reactContext: ReactApplicationContext
  ): List<ViewManager<*, *>> = emptyList()
}
