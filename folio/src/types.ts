export type Format = 'pdf' | 'epub' | 'txt' | 'docx';

export interface Book {
  id: string;
  name: string;
  format: Format;
  uri: string; // copia local dentro del sandbox de la app
  coverUri?: string;
  addedAt: number;
  lastOpenedAt?: number;
}
