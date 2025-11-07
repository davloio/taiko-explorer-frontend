'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ApolloWrapper } from '@/components/apollo-wrapper';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Taiko Explorer</title>
        <meta name="description" content="Explore the Taiko blockchain with our fast and user-friendly block explorer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/taiko-icon.webp" type="image/webp" />
        <link rel="shortcut icon" href="/taiko-icon.webp" type="image/webp" />
        <link rel="apple-touch-icon" href="/taiko-icon.webp" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
        <ApolloWrapper>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ApolloWrapper>
      </body>
    </html>
  );
}