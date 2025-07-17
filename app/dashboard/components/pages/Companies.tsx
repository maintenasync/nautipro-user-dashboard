// app/dashboard/components/pages/Companies.tsx

'use client';

import { useState } from 'react';

interface Company {
    id: number;
    name: string;
    location: string;
    vessels: number;
    created: string;
}

interface CompaniesProps {
    onNavigateToCreate?: () => void;
}

export default function Companies({ onNavigateToCreate }: CompaniesProps) {
    const [companies, setCompanies] = useState<Company[]>([
        { id: 1, name: 'Ocean Shipping Ltd', location: 'Singapore', vessels: 5, created: '2024-01-15' },
        { id: 2, name: 'Maritime Solutions Inc', location: 'Hong Kong', vessels: 3, created: '2024-02-20' },
        { id: 3, name: 'Global Fleet Management', location: 'Indonesia', vessels: 4, created: '2024-03-10' },
    ]);

    const handleCreateCompany = () => {
        if (onNavigateToCreate) {
            onNavigateToCreate();
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Companies</h1>
                <button
                    onClick={handleCreateCompany}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Create New Company
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company) => (
                    <div key={company.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{company.name}</h3>
                        <p className="text-gray-600 mb-2">📍 {company.location}</p>
                        <p className="text-gray-600 mb-2">🚢 {company.vessels} Vessels</p>
                        <p className="text-sm text-gray-500">Created: {company.created}</p>
                        <div className="mt-4 flex space-x-2">
                            <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200">Edit</button>
                            <button className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}