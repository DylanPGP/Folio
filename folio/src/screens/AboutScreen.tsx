import React from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../context/SettingsContext';

const GITHUB = 'https://github.com/DylanPGP';

export default function AboutScreen() {
  const { colors } = useSettings();
  const open = () => Linking.openURL(GITHUB);

  const Item = ({ icon, label, value, onPress }: any) => (
    <Pressable onPress={onPress} disabled={!onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16 }}>
      <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '700', letterSpacing: 1.6 }}>{label}</Text>
        <Text style={{ color: colors.text, fontSize: 17, fontWeight: '600', marginTop: 2 }}>{value}</Text>
      </View>
      {onPress && <Ionicons name="chevron-forward" size={20} color={colors.sub} />}
    </Pressable>
  );
  const Card = ({ children }: any) => (
    <View style={{ backgroundColor: colors.card, borderRadius: 22, overflow: 'hidden', marginBottom: 14 }}>{children}</View>
  );

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16 }}>
      {/* Superior: DylanRC, sin imagen de perfil */}
      <Pressable onPress={open} style={{ backgroundColor: colors.card, borderRadius: 22, padding: 28, marginBottom: 14 }}>
        <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 2 }}>DESARROLLADOR</Text>
        <Text style={{ color: colors.text, fontSize: 34, fontWeight: '800', marginTop: 4 }}>DylanRC</Text>
      </Pressable>

      <Card>
        <Item icon="book-outline" label="APP" value="Folio" />
        <Item icon="information-circle" label="VERSIÓN" value={Constants.expoConfig?.version ?? '1.0.0'} />
      </Card>
      <Card>
        <Item icon="logo-github" label="CÓDIGO FUENTE" value="Folio en GitHub" onPress={open} />
        <Item icon="document-text-outline" label="LICENCIA" value="MIT License" />
      </Card>
      <Card>
        <Item
          icon="heart" label="HECHO CON AMOR"
          value="Folio es de código abierto, no tiene anuncios y respeta tu privacidad: todo se queda en tu dispositivo."
        />
      </Card>
    </ScrollView>
  );
}
