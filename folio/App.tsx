import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';
import { SettingsProvider, useSettings } from './src/context/SettingsContext';
import { LibraryProvider } from './src/context/LibraryContext';
import RootNavigator from './src/navigation/RootNavigator';

function Gate({ children }: { children: React.ReactNode }) {
  const { ready, biometric, colors } = useSettings();
  const [ok, setOk] = useState(false);

  const unlock = async () => {
    const r = await LocalAuthentication.authenticateAsync({ promptMessage: 'Desbloquear Folio' });
    if (r.success) setOk(true);
  };

  useEffect(() => {
    if (ready && biometric && !ok) unlock();
  }, [ready, biometric]);

  if (!ready) return null;
  if (!biometric || ok) return <>{children}</>;
  return (
    <View style={[s.lock, { backgroundColor: colors.bg }]}>
      <Ionicons name="finger-print" size={72} color={colors.primary} />
      <Text style={[s.lockTitle, { color: colors.text }]}>Folio está bloqueado</Text>
      <Pressable onPress={unlock} style={[s.btn, { backgroundColor: colors.primary }]}>
        <Text style={s.btnText}>Desbloquear</Text>
      </Pressable>
    </View>
  );
}

function Shell() {
  const { colors, isDark } = useSettings();
  const base = isDark ? DarkTheme : DefaultTheme;
  const theme = {
    ...base,
    colors: { ...base.colors, background: colors.bg, card: colors.bar, text: colors.text, border: colors.border, primary: colors.primary },
  };
  return (
    <Gate>
      <NavigationContainer theme={theme}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.bg} />
        <RootNavigator />
      </NavigationContainer>
    </Gate>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <LibraryProvider>
          <Shell />
        </LibraryProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  lock: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  lockTitle: { fontSize: 20, fontWeight: '600' },
  btn: { paddingHorizontal: 28, paddingVertical: 12, borderRadius: 24 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
