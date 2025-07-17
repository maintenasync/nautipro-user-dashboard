// components/ProtectedRoute.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { state } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Hanya lakukan pengecekan dan redireksi setelah inisialisasi selesai
        if (state.isInitialized && !state.isAuthenticated) {
            router.push('/login');
        }
    }, [state.isAuthenticated, state.isInitialized, router]); // Tambahkan isInitialized sebagai dependency

    // Tampilkan loading spinner jika belum diinisialisasi ATAU belum terotentikasi
    // dan proses inisialisasi sedang berlangsung
    if (!state.isInitialized || !state.isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center">
                    <svg className="animate-spin h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // Render children jika sudah diinisialisasi DAN terotentikasi
    return <>{children}</>;
}