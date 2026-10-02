import React from 'react';
import { Text, View } from 'react-native';
import { Format } from '../types';
import { FORMAT_META } from '../utils/format';
import { useSettings } from '../context/SettingsContext';

export default function FormatBadge({ format }: { format: Format }) {
  const { colors } = useSettings();
  return (
    <View style={{ alignSelf: 'flex-start', backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4 }}>
      <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 0.6 }}>{FORMAT_META[format].label}</Text>
    </View>
  );
}
