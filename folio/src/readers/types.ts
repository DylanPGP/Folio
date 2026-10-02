import { Book } from '../types';

export interface ReaderProps {
  book: Book;
  query: string;
  tick: number; // sube cada vez que el usuario confirma la búsqueda (Enter)
  onCount: (n: number) => void;
}
