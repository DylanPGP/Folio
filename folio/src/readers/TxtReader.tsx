import React, { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import HtmlReader from './HtmlReader';
import { ReaderProps } from './types';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default function TxtReader({ book, ...rest }: ReaderProps) {
  const [html, setHtml] = useState<string | null>(null);
  useEffect(() => {
    FileSystem.readAsStringAsync(book.uri, { encoding: FileSystem.EncodingType.UTF8 })
      .then((t) => setHtml(`<pre>${esc(t)}</pre>`))
      .catch(() => setHtml('<p>No se pudo leer el archivo.</p>'));
  }, [book.uri]);
  return html === null ? null : <HtmlReader html={html} {...rest} />;
}
