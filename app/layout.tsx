// app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './contexts/AuthContext';
import ClientThemeProvider from './components/providers/ClientThemeProvider';
import QueryProvider from './providers/QueryProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Maintena Sync Dashboard - Nautipro Connect Solutions',
    description: 'Planned maintenance system for vessels and crews',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning>
        <ClientThemeProvider>
            {/*
                        PENTING: QueryProvider HARUS di atas AuthProvider
                        Karena AuthProvider menggunakan useQueryClient()
                    */}
            <QueryProvider>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </QueryProvider>
        </ClientThemeProvider>
        </body>
        </html>
    );
}