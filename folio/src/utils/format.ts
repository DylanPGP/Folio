import { Format } from '../types';

export const FORMAT_META: Record<Format, { label: string; color: string; icon: string; mime: string }> = {
  pdf: { label: 'PDF', color: '#E5484D', icon: 'document-text', mime: 'application/pdf' },
  epub: { label: 'EPUB', color: '#3E8E7E', icon: 'book', mime: 'application/epub+zip' },
  txt: { label: 'TXT', color: '#6B7194', icon: 'reader', mime: 'text/plain' },
  docx: {
    label: 'DOCX', color: '#2F6FEB', icon: 'document',
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
};

export function detectFormat(fileName: string): Format | null {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return ext === 'pdf' || ext === 'epub' || ext === 'txt' || ext === 'docx' ? ext : null;
}

export const stripExt = (n: string) => n.replace(/\.[^/.]+$/, '');
