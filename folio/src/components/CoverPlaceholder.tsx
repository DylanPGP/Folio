import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Format } from '../types';
import { FORMAT_META } from '../utils/format';

/** Portada generada automáticamente según el tipo de archivo. */
export default function CoverPlaceholder({ format }: { format: Format }) {
  const m = FORMAT_META[format];
  return (
    <View style={{ flex: 1, backgroundColor: m.color + '26', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
      <Ionicons name={m.icon as any} size={38} color={m.color} />
      <Text style={{ color: m.color, fontWeight: '800', fontSize: 15, letterSpacing: 1 }}>{m.label}</Text>
    </View>
  );
}
