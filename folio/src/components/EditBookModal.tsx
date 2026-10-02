import React, { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Book } from '../types';
import { useLibrary } from '../context/LibraryContext';
import { useSettings } from '../context/SettingsContext';

export default function EditBookModal({ book, onClose }: { book: Book | null; onClose: () => void }) {
  const { colors } = useSettings();
  const { renameBook, pickCover, clearCover, removeBook } = useLibrary();
  const [name, setName] = useState('');
  useEffect(() => setName(book?.name ?? ''), [book?.id]);
  if (!book) return null;

  const Row = ({ icon, label, onPress, danger }: any) => (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 }}>
      <Ionicons name={icon} size={20} color={danger ? '#E5484D' : colors.primary} />
      <Text style={{ color: danger ? '#E5484D' : colors.text, fontSize: 15 }}>{label}</Text>
    </Pressable>
  );

  const save = () => { renameBook(book.id, name); onClose(); };

  return (
    <Modal transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: '#0008' }} onPress={onClose} />
      <View style={{ backgroundColor: colors.bar, padding: 20, paddingBottom: 32, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
        <Text style={{ color: colors.sub, fontSize: 12, fontWeight: '700', letterSpacing: 1.2 }}>NOMBRE</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          onSubmitEditing={save}
          style={{ color: colors.text, fontSize: 17, borderBottomWidth: 1, borderColor: colors.border, paddingVertical: 8, marginBottom: 8 }}
        />
        <Row icon="image-outline" label="Cambiar portada" onPress={() => pickCover(book.id)} />
        {book.coverUri && <Row icon="refresh-outline" label="Usar portada automática" onPress={() => clearCover(book.id)} />}
        <Row
          icon="trash-outline" label="Eliminar de Folio" danger
          onPress={() =>
            Alert.alert('Eliminar', `¿Eliminar "${book.name}" de Folio?`, [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Eliminar', style: 'destructive', onPress: () => { removeBook(book.id); onClose(); } },
            ])
          }
        />
        <Pressable onPress={save} style={{ backgroundColor: colors.primary, borderRadius: 22, paddingVertical: 12, alignItems: 'center', marginTop: 8 }}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Guardar</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
