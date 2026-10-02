import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Book } from '../types';
import { useSettings } from '../context/SettingsContext';
import PressableScale from './PressableScale';
import CoverPlaceholder from './CoverPlaceholder';
import FormatBadge from './FormatBadge';

interface Props { book: Book; width: number; onPress: () => void; onMenu: () => void }

export default function BookCard({ book, width, onPress, onMenu }: Props) {
  const { colors } = useSettings();
  return (
    <PressableScale onPress={onPress} style={{ width }} scaleTo={0.95}>
      <View style={{ width, height: width * 1.35, borderRadius: 14, overflow: 'hidden', backgroundColor: colors.card }}>
        {book.coverUri
          ? <Image source={{ uri: book.coverUri }} style={{ flex: 1 }} resizeMode="cover" />
          : <CoverPlaceholder format={book.format} />}
        <Pressable
          onPress={onMenu}
          hitSlop={10}
          style={{ position: 'absolute', top: 6, right: 4, backgroundColor: '#0006', borderRadius: 12, padding: 3 }}
        >
          <Ionicons name="ellipsis-vertical" size={16} color="#fff" />
        </Pressable>
      </View>
      <Text numberOfLines={2} style={{ color: colors.text, fontSize: 13, marginTop: 6 }}>{book.name}</Text>
      <FormatBadge format={book.format} />
    </PressableScale>
  );
}
