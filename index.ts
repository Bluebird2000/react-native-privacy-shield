import { Platform, AppState, AppStateStatus } from 'react-native';
import React, { useEffect } from 'react';
import RNPrivacyShieldNative from './nativeModule';P
import NetInfo from '@react-native-community/netinfo';

// ---- Native Module Definition ----
export const enableScreenSecurity = () => {
  if (Platform.OS === 'android') {
    RNPrivacyShieldNative.enableAndroidSecureFlag();
  } else if (Platform.OS === 'ios') {
    RNPrivacyShieldNative.enableIOSScreenCapturePrevention();
  }
};

export const disableScreenSecurity = () => {
  if (Platform.OS === 'android') {
    RNPrivacyShieldNative.disableAndroidSecureFlag();
  } else if (Platform.OS === 'ios') {
    RNPrivacyShieldNative.disableIOSScreenCapturePrevention();
  }
};

// ---- Redact Multitasking Preview ----
export const useRedactMultitaskPreview = () => {
  useEffect(() => {
    if (Platform.OS === 'ios') {
      RNPrivacyShieldNative.setMultitaskingPreviewRedacted(true);
      return () => RNPrivacyShieldNative.setMultitaskingPreviewRedacted(false);
    }
  }, []);
};

// ---- Insecure Network Detection ----
export const useInsecureNetworkAlert = (onInsecureDetected: () => void) => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        const isUnsafe = state.details?.isConnectionExpensive || !state.isInternetReachable;
        if (isUnsafe) onInsecureDetected();
      }
    });

    return () => unsubscribe();
  }, []);
};

// ---- Cookie and Tracking Data Cleaner ----
export const clearTrackingData = async (): Promise<void> => {
  await RNPrivacyShieldNative.clearCookies();
  await RNPrivacyShieldNative.clearLocalStorage();
  await RNPrivacyShieldNative.clearTrackingCache();
};

// ---- Secure Logger ----
type LogLevel = 'info' | 'warn' | 'error';

export const secureLog = (message: string, level: LogLevel = 'info', obfuscateKeys: string[] = []) => {
  const obfuscated = obfuscateKeys.reduce((msg, key) => {
    const regex = new RegExp(`${key}=([^&\s]+)`, 'g');
    return msg.replace(regex, `${key}=****`);
  }, message);

  switch (level) {
    case 'info':
      console.info(`[PrivacyShield] ${obfuscated}`);
      break;
    case 'warn':
      console.warn(`[PrivacyShield] ${obfuscated}`);
      break;
    case 'error':
      console.error(`[PrivacyShield] ${obfuscated}`);
      break;
  }
};

// ---- Screen Shield Hook for Sensitive Screens ----
export const useScreenPrivacyShield = () => {
  useEffect(() => {
    enableScreenSecurity();
    return () => disableScreenSecurity();
  }, []);
};

// ---- App State Tracking for Auto Privacy ----
export const useAutoShieldOnBackground = () => {
  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState !== 'active') {
        enableScreenSecurity();
      } else {
        disableScreenSecurity();
      }
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);
};

// ---- Exports ----
export default {
  enableScreenSecurity,
  disableScreenSecurity,
  useScreenPrivacyShield,
  useRedactMultitaskPreview,
  useInsecureNetworkAlert,
  clearTrackingData,
  secureLog,
  useAutoShieldOnBackground,
};