import React, { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { Reader, ReaderProvider, useReader } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system';
import { ReaderProps } from './types';

function Inner({ book, query, tick, onCount }: ReaderProps) {
  const { width, height } = useWindowDimensions();
  const { search, searchResults, goToLocation } = useReader();

  useEffect(() => {
    if (tick > 0 && query) search(query);
  }, [tick]);

  // La forma de searchResults puede variar según la versión de la librería: revísala al actualizar.
  useEffect(() => {
    const r: any = (searchResults as any)?.results;
    if (Array.isArray(r)) {
      onCount(r.length);
      if (r.length) goToLocation(r[0].cfi);
    }
  }, [searchResults]);

  return <Reader src={book.uri} width={width} height={height - 150} fileSystem={useFileSystem} />;
}

export default function EpubReader(props: ReaderProps) {
  return (
    <ReaderProvider>
      <Inner {...props} />
    </ReaderProvider>
  );
}
