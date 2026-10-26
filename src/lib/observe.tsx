import React from 'react';
import Constants, { ExecutionEnvironment } from 'expo-constants';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let SafeObserveRoot: React.ComponentType<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
let SafeObserve: { markInteractive: () => void } = {
  markInteractive: () => {},
};

if (!isExpoGo) {
  try {
    const observePkg = require('expo-observe');
    if (observePkg?.ObserveRoot) {
      SafeObserveRoot = observePkg.ObserveRoot;
    }
    if (observePkg?.Observe) {
      SafeObserve = observePkg.Observe;
    }
  } catch {
    // Graceful fallback when native module is absent (e.g. standard Expo Go)
  }
}

export { SafeObserveRoot as ObserveRoot, SafeObserve as Observe };
