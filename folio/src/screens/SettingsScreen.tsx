import React from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeMode, useSettings } from '../context/SettingsContext';

const THEMES: { mode: ThemeMode; label: string; icon: string }[] = [
  { mode: 'system', label: 'Por defecto del sistema', icon: 'phone-portrait-outline' },
  { mode: 'light', label: 'Claro', icon: 'sunny-outline' },
  { mode: 'dark', label: 'Oscuro', icon: 'moon-outline' },
];

export default function SettingsScreen() {
  const nav = useNavigation<any>();
  const { colors, mode, setMode, biometric, setBiometric } = useSettings();

  const Label = ({ t }: { t: string }) => (
    <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1.4, marginTop: 20, marginBottom: 8, marginLeft: 6 }}>{t}</Text>
  );
  const Card = ({ children }: any) => (
    <View style={{ backgroundColor: colors.card, borderRadius: 18, overflow: 'hidden' }}>{children}</View>
  );
  const Row = ({ icon, label, onPress, right }: any) => (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 }}>
      <Ionicons name={icon} size={22} color={colors.primary} />
      <Text style={{ flex: 1, color: colors.text, fontSize: 16 }}>{label}</Text>
      {right}
    </Pressable>
  );

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16 }}>
      <Label t="TEMA / COLOR" />
      <Card>
        {THEMES.map((t) => (
          <Row
            key={t.mode} icon={t.icon} label={t.label} onPress={() => setMode(t.mode)}
            right={mode === t.mode ? <Ionicons name="checkmark-circle" size={22} color={colors.primary} /> : null}
          />
        ))}
      </Card>

      <Label t="SEGURIDAD" />
      <Card>
        <Row
          icon="finger-print" label="Bloqueo con huella"
          right={<Switch value={biometric} onValueChange={setBiometric} trackColor={{ true: colors.primary }} />}
        />
      </Card>

      <Label t="ACERCA DE" />
      <Card>
        <Row icon="information-circle-outline" label="About" onPress={() => nav.navigate('About')}
          right={<Ionicons name="chevron-forward" size={20} color={colors.sub} />} />
      </Card>
    </ScrollView>
  );
}
