// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeRegistry from '@/components/ThemeRegistry';

// Nossas novas importações
import ResponsiveAppBar from '@/components/AppBar';
import { Container } from '@mui/material';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gestão de AirTags',
  description: 'Sistema de gerenciamento de locação de dispositivos.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeRegistry>
          {/* Adicionamos nossa barra de navegação aqui */}
          <ResponsiveAppBar />

          {/* O Container vai centralizar o conteúdo das páginas */}
          <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {children}
          </Container>
          
        </ThemeRegistry>
      </body>
    </html>
  );
}