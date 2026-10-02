import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../context/SettingsContext';

interface Props {
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  onSubmit?: () => void;
  autoFocus?: boolean;
  hint?: string;
}

export default function SearchBar({ value, onChangeText, placeholder, onSubmit, autoFocus, hint }: Props) {
  const { colors } = useSettings();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 16, paddingHorizontal: 14, height: 46, gap: 8 }}>
      <Ionicons name="search" size={18} color={colors.sub} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.sub}
        style={{ flex: 1, color: colors.text, fontSize: 15 }}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        autoFocus={autoFocus}
      />
      {hint ? <Text style={{ color: colors.sub, fontSize: 12 }}>{hint}</Text> : null}
      {value ? (
        <Pressable onPress={() => onChangeText('')} hitSlop={10}>
          <Ionicons name="close-circle" size={18} color={colors.sub} />
        </Pressable>
      ) : null}
    </View>
  );
}
