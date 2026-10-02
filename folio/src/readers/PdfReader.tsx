import React from 'react';
import Pdf from 'react-native-pdf';
import { useSettings } from '../context/SettingsContext';
import { ReaderProps } from './types';

// Nota: react-native-pdf no ofrece búsqueda de texto; queda como mejora pendiente.
export default function PdfReader({ book }: ReaderProps) {
  const { colors } = useSettings();
  return (
    <Pdf
      source={{ uri: book.uri }}
      style={{ flex: 1, backgroundColor: colors.bg }}
      trustAllCerts={false}
      enablePaging={false}
    />
  );
}
