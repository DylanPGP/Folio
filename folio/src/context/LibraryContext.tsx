import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { Book } from '../types';
import { detectFormat, stripExt } from '../utils/format';

const KEY = 'folio.books.v1';
const DIR = FileSystem.documentDirectory + 'folio/';

interface Ctx {
  books: Book[];
  importBook: () => Promise<void>;
  markOpened: (id: string) => void;
  renameBook: (id: string, name: string) => void;
  pickCover: (id: string) => Promise<void>;
  clearCover: (id: string) => void;
  removeBook: (id: string) => Promise<void>;
}
const LibraryCtx = createContext<Ctx>(null as any);
export const useLibrary = () => useContext(LibraryCtx);

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const safeDelete = (uri?: string) => (uri ? FileSystem.deleteAsync(uri, { idempotent: true }) : Promise.resolve());

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => raw && setBooks(JSON.parse(raw)))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(KEY, JSON.stringify(books));
  }, [books, loaded]);

  const patch = (id: string, p: Partial<Book>) =>
    setBooks((bs) => bs.map((b) => (b.id === id ? { ...b, ...p } : b)));

  const ensureDir = async () => {
    const info = await FileSystem.getInfoAsync(DIR);
    if (!info.exists) await FileSystem.makeDirectoryAsync(DIR, { intermediates: true });
  };

  const importBook = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: '*/*', multiple: true, copyToCacheDirectory: true });
    if (res.canceled) return;
    await ensureDir();
    let skipped = 0;
    const added: Book[] = [];
    for (const a of res.assets) {
      const format = detectFormat(a.name);
      if (!format) { skipped++; continue; }
      const id = uid();
      const dest = `${DIR}${id}.${format}`;
      await FileSystem.moveAsync({ from: a.uri, to: dest });
      added.push({ id, name: stripExt(a.name), format, uri: dest, addedAt: Date.now() });
    }
    if (added.length) setBooks((bs) => [...added, ...bs]);
    if (skipped) Alert.alert('Formato no compatible', 'Folio admite PDF, EPUB, TXT y DOCX.');
  };

  const pickCover = async (id: string) => {
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsEditing: true, aspect: [3, 4], quality: 0.7,
    });
    if (r.canceled) return;
    await ensureDir();
    const dest = `${DIR}${id}_cover_${Date.now()}.jpg`;
    await FileSystem.copyAsync({ from: r.assets[0].uri, to: dest });
    const old = books.find((b) => b.id === id)?.coverUri;
    await safeDelete(old);
    patch(id, { coverUri: dest });
  };

  const clearCover = (id: string) => {
    safeDelete(books.find((b) => b.id === id)?.coverUri);
    patch(id, { coverUri: undefined });
  };

  const removeBook = async (id: string) => {
    const b = books.find((x) => x.id === id);
    if (!b) return;
    await safeDelete(b.uri);
    await safeDelete(b.coverUri);
    setBooks((bs) => bs.filter((x) => x.id !== id));
  };

  return (
    <LibraryCtx.Provider
      value={{
        books, importBook, pickCover, clearCover, removeBook,
        markOpened: (id) => patch(id, { lastOpenedAt: Date.now() }),
        renameBook: (id, name) => name.trim() && patch(id, { name: name.trim() }),
      }}
    >
      {children}
    </LibraryCtx.Provider>
  );
}
