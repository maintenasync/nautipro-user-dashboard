// app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './contexts/AuthContext';
import ClientThemeProvider from './components/providers/ClientThemeProvider';
import QueryProvider from './providers/QueryProvider'; // ADD THIS IMPORT

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Maritime Dashboard - Nautipro Connect',
    description: 'Maritime Dashboard Management System',
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
            <AuthProvider>
                <QueryProvider>
                    {children}
                </QueryProvider>
            </AuthProvider>
        </ClientThemeProvider>
        </body>
        </html>
    );
}