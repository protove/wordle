import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cosmic Wordle',
  description: 'A cosmic-themed Wordle game — guess the 5-letter word in 6 tries!',
  keywords: ['wordle', 'cosmic', 'word game', 'puzzle'],
  authors: [{ name: 'Cosmic Wordle' }],
  themeColor: '#141A26',
  openGraph: {
    title: 'Cosmic Wordle',
    description: 'Guess the cosmic 5-letter word in 6 tries!',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-cosmic-dark text-cosmic-white antialiased">
        {children}
      </body>
    </html>
  );
}
