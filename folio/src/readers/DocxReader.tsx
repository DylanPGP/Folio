import React, { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';
// @ts-ignore
import mammoth from 'mammoth';
import HtmlReader from './HtmlReader';
import { ReaderProps } from './types';

export default function DocxReader({ book, ...rest }: ReaderProps) {
  const [html, setHtml] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const b64 = await FileSystem.readAsStringAsync(book.uri, { encoding: FileSystem.EncodingType.Base64 });
        const { value } = await mammoth.convertToHtml({ arrayBuffer: decode(b64) });
        setHtml(value || '<p>(Documento vacío)</p>');
      } catch {
        setHtml('<p>No se pudo abrir el documento DOCX.</p>');
      }
    })();
  }, [book.uri]);
  return html === null ? null : <HtmlReader html={html} {...rest} />;
}
