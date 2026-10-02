import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useLibrary } from '../context/LibraryContext';
import { useSettings } from '../context/SettingsContext';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';
import EditBookModal from '../components/EditBookModal';

const COLS = 3, PAD = 16, GAP = 12;

export default function HomeScreen() {
  const nav = useNavigation<any>();
  const { colors } = useSettings();
  const { books } = useLibrary();
  const { width } = useWindowDimensions();
  const [q, setQ] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const cw = (width - PAD * 2 - GAP * (COLS - 1)) / COLS;

  const data = useMemo(() => {
    const t = q.trim().toLowerCase();
    return books
      .filter((b) => b.name.toLowerCase().includes(t))
      .sort((a, b) => (b.lastOpenedAt ?? b.addedAt) - (a.lastOpenedAt ?? a.addedAt));
  }, [books, q]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <View style={{ paddingHorizontal: PAD, paddingTop: 8, gap: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: colors.text, fontSize: 28, fontWeight: '800' }}>Folio</Text>
          <Pressable onPress={() => nav.navigate('Settings')} hitSlop={12}>
            <Ionicons name="settings-outline" size={24} color={colors.text} />
          </Pressable>
        </View>
        <SearchBar value={q} onChangeText={setQ} placeholder="Buscar por nombre" />
      </View>

      <FlatList
        data={data}
        keyExtractor={(b) => b.id}
        numColumns={COLS}
        columnWrapperStyle={{ gap: GAP }}
        contentContainerStyle={{ padding: PAD, gap: 16, paddingBottom: 140 }}
        renderItem={({ item }) => (
          <BookCard book={item} width={cw} onPress={() => nav.navigate('Reader', { id: item.id })} onMenu={() => setEditId(item.id)} />
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 80, gap: 10 }}>
            <Ionicons name="library-outline" size={56} color={colors.sub} />
            <Text style={{ color: colors.sub, textAlign: 'center' }}>
              {books.length ? 'Sin resultados' : 'Toca + para importar un PDF, EPUB, TXT o DOCX'}
            </Text>
          </View>
        }
      />
      <EditBookModal book={books.find((b) => b.id === editId) ?? null} onClose={() => setEditId(null)} />
    </SafeAreaView>
  );
}
