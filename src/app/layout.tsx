'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ApolloWrapper } from '@/components/apollo-wrapper';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
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
        <link rel="icon" href="/Taiko Labs Logo.jpeg" type="image/jpeg" />
        <link rel="shortcut icon" href="/Taiko Labs Logo.jpeg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/Taiko Labs Logo.jpeg" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
        <ThemeProvider>
          <ApolloWrapper>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}