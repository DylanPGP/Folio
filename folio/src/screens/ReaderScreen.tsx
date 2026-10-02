import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import { useLibrary } from '../context/LibraryContext';
import { useSettings } from '../context/SettingsContext';
import { FORMAT_META } from '../utils/format';
import SearchBar from '../components/SearchBar';
import TxtReader from '../readers/TxtReader';
import DocxReader from '../readers/DocxReader';
import PdfReader from '../readers/PdfReader';
import EpubReader from '../readers/EpubReader';

export default function ReaderScreen({ route, navigation }: any) {
  const { id } = route.params;
  const { colors } = useSettings();
  const { books, markOpened } = useLibrary();
  const book = books.find((b) => b.id === id);
  const [searching, setSearching] = useState(false);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState({ q: '', n: 0 });
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => { markOpened(id); }, [id]);
  if (!book) return null;

  const share = async () => {
    if (!(await Sharing.isAvailableAsync())) return Alert.alert('Compartir no disponible');
    Sharing.shareAsync(book.uri, { mimeType: FORMAT_META[book.format].mime, dialogTitle: book.name });
  };

  const props = { book, query: submitted.q, tick: submitted.n, onCount: setCount };
  const reader =
    book.format === 'txt' ? <TxtReader {...props} /> :
    book.format === 'docx' ? <DocxReader {...props} /> :
    book.format === 'epub' ? <EpubReader {...props} /> :
    <PdfReader {...props} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Barra superior: solo atrás, título, buscar y compartir */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 20 }}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text numberOfLines={1} style={{ flex: 1, color: colors.text, fontSize: 16, fontWeight: '600' }}>{book.name}</Text>
        <Pressable onPress={() => setSearching((v) => !v)} hitSlop={10}>
          <Ionicons name={searching ? 'close' : 'search'} size={23} color={colors.text} />
        </Pressable>
        <Pressable onPress={share} hitSlop={10}>
          <Ionicons name="share-social" size={23} color={colors.text} />
        </Pressable>
      </View>

      {searching && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <SearchBar
            autoFocus
            value={text}
            onChangeText={(t) => { setText(t); if (!t) { setSubmitted((s) => ({ q: '', n: s.n + 1 })); setCount(null); } }}
            onSubmit={() => setSubmitted((s) => ({ q: text.trim(), n: s.n + 1 }))}
            placeholder={book.format === 'pdf' ? 'Búsqueda no disponible en PDF' : 'Buscar en el documento'}
            hint={count !== null ? `${count}` : undefined}
          />
        </View>
      )}
      <View style={{ flex: 1 }}>{reader}</View>
    </SafeAreaView>
  );
}
