'use client';

import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { ApolloWrapper } from '@/components/apollo-wrapper';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

function ThemedBody({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${theme === 'pink' ? 'bg-gradient-to-br from-[#C2185B] to-pink-500' : 'bg-gradient-to-br from-white to-pink-100'}`}>
      {children}
    </div>
  );
}

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
      <body className={montserrat.className}>
        <ThemeProvider>
          <ThemedBody>
            <ApolloWrapper>
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </ApolloWrapper>
          </ThemedBody>
        </ThemeProvider>
      </body>
    </html>
  );
}