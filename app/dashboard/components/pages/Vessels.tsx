// app/dashboard/components/pages/Vessels.tsx

'use client';

import { useState } from 'react';

interface Vessel {
    id: number;
    name: string;
    type: string;
    company: string;
    status: string;
    imo: string;
}

interface VesselsProps {
    onNavigateToCreate?: () => void;
}

export default function Vessels({ onNavigateToCreate }: VesselsProps) {
    const [vessels, setVessels] = useState<Vessel[]>([
        { id: 1, name: 'Ocean Explorer', type: 'Cargo Ship', company: 'Ocean Shipping Ltd', status: 'Active', imo: 'IMO1234567' },
        { id: 2, name: 'Sea Pioneer', type: 'Tanker', company: 'Maritime Solutions Inc', status: 'Active', imo: 'IMO2345678' },
        { id: 3, name: 'Wave Rider', type: 'Container Ship', company: 'Global Fleet Management', status: 'Maintenance', imo: 'IMO3456789' },
    ]);

    const handleCreateVessel = () => {
        if (onNavigateToCreate) {
            onNavigateToCreate();
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Vessels</h1>
                <button
                    onClick={handleCreateVessel}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Add New Vessel
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vessel Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IMO Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {vessels.map((vessel) => (
                        <tr key={vessel.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vessel.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vessel.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vessel.company}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vessel.imo}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      vessel.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {vessel.status}
                  </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button className="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
                                <button className="text-red-600 hover:text-red-900">Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}