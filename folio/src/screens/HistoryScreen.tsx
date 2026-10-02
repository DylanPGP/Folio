import React, { useMemo } from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useLibrary } from '../context/LibraryContext';
import { useSettings } from '../context/SettingsContext';
import PressableScale from '../components/PressableScale';
import CoverPlaceholder from '../components/CoverPlaceholder';
import FormatBadge from '../components/FormatBadge';

export default function HistoryScreen() {
  const nav = useNavigation<any>();
  const { colors } = useSettings();
  const { books } = useLibrary();
  const data = useMemo(
    () => books.filter((b) => b.lastOpenedAt).sort((a, b) => b.lastOpenedAt! - a.lastOpenedAt!),
    [books]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <Text style={{ color: colors.text, fontSize: 28, fontWeight: '800', padding: 16 }}>Historial</Text>
      <FlatList
        data={data}
        keyExtractor={(b) => b.id}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 140 }}
        renderItem={({ item }) => (
          <PressableScale
            onPress={() => nav.navigate('Reader', { id: item.id })}
            scaleTo={0.97}
            style={{ flexDirection: 'row', gap: 12, backgroundColor: colors.card, borderRadius: 16, padding: 10, alignItems: 'center' }}
          >
            <View style={{ width: 48, height: 64, borderRadius: 8, overflow: 'hidden' }}>
              {item.coverUri ? <Image source={{ uri: item.coverUri }} style={{ flex: 1 }} /> : <CoverPlaceholder format={item.format} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={{ color: colors.text, fontSize: 15, fontWeight: '600' }}>{item.name}</Text>
              <Text style={{ color: colors.sub, fontSize: 12, marginTop: 2 }}>{new Date(item.lastOpenedAt!).toLocaleString()}</Text>
              <FormatBadge format={item.format} />
            </View>
          </PressableScale>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 80, gap: 10 }}>
            <Ionicons name="time-outline" size={56} color={colors.sub} />
            <Text style={{ color: colors.sub }}>Aún no has leído nada</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
