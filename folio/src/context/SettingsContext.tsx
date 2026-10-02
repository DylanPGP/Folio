import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { Colors, dark, light } from '../theme/theme';

export type ThemeMode = 'system' | 'light' | 'dark';
const KEY = 'folio.settings.v1';

interface Ctx {
  ready: boolean;
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  biometric: boolean;
  setBiometric: (v: boolean) => Promise<void>;
  colors: Colors;
  isDark: boolean;
}
const SettingsCtx = createContext<Ctx>(null as any);
export const useSettings = () => useContext(SettingsCtx);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const [ready, setReady] = useState(false);
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [biometric, setBiometricState] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) {
          const v = JSON.parse(raw);
          setModeState(v.mode ?? 'system');
          setBiometricState(!!v.biometric);
        }
      })
      .finally(() => setReady(true));
  }, []);

  const persist = (m: ThemeMode, b: boolean) =>
    AsyncStorage.setItem(KEY, JSON.stringify({ mode: m, biometric: b }));

  const setMode = (m: ThemeMode) => { setModeState(m); persist(m, biometric); };

  const setBiometric = async (v: boolean) => {
    if (v) {
      const hw = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hw || !enrolled) {
        Alert.alert('Huella no disponible', 'Configura una huella en los ajustes del dispositivo.');
        return;
      }
      const r = await LocalAuthentication.authenticateAsync({ promptMessage: 'Confirma para activar el bloqueo' });
      if (!r.success) return;
    }
    setBiometricState(v);
    persist(mode, v);
  };

  const isDark = mode === 'system' ? scheme === 'dark' : mode === 'dark';
  return (
    <SettingsCtx.Provider value={{ ready, mode, setMode, biometric, setBiometric, colors: isDark ? dark : light, isDark }}>
      {children}
    </SettingsCtx.Provider>
  );
}
