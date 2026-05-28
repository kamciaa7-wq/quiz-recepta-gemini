import './style.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Test wiedzy o Recepcie Gemini',
  description: 'Quiz konkursowy Recepta Gemini'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pl"><body>{children}</body></html>;
}
