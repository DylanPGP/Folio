import React, { useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { useSettings } from '../context/SettingsContext';
import { SEARCH_SCRIPT } from './searchScript';

interface Props { html: string; query: string; tick: number; onCount: (n: number) => void }

/** Visor HTML compartido por TXT y DOCX, con búsqueda dentro del texto. */
export default function HtmlReader({ html, query, tick, onCount }: Props) {
  const { colors } = useSettings();
  const ref = useRef<WebView>(null);

  const page = `<!doctype html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
body{margin:0;padding:20px 20px 60px;background:${colors.bg};color:${colors.text};font:17px/1.7 Georgia,serif;word-wrap:break-word}
img{max-width:100%;height:auto}pre{white-space:pre-wrap;font:inherit;margin:0}
table{border-collapse:collapse}td,th{border:1px solid ${colors.border};padding:4px}
mark.f{background:#FFD54A;color:#000}mark.cur{background:#FF8A3D}
</style></head><body>${html}<script>${SEARCH_SCRIPT}</script></body></html>`;

  useEffect(() => {
    if (tick > 0) ref.current?.injectJavaScript(`window.folioFind(${JSON.stringify(query)});true;`);
  }, [tick]);

  return (
    <WebView
      ref={ref}
      originWhitelist={['*']}
      source={{ html: page }}
      style={{ backgroundColor: colors.bg }}
      onMessage={(e) => {
        try { onCount(JSON.parse(e.nativeEvent.data).count); } catch {}
      }}
    />
  );
}
