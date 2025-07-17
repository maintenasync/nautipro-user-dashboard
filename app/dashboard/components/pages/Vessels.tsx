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
    onNavigateToDetail?: (vesselId: number) => void;
}

export default function Vessels({ onNavigateToCreate, onNavigateToDetail }: VesselsProps) {
    const [vessels, setVessels] = useState<Vessel[]>([
        {
            id: 1,
            name: 'Ocean Explorer',
            type: 'Cargo Ship',
            company: 'Ocean Shipping Ltd',
            status: 'Active',
            imo: 'IMO1234567'
        },
        {
            id: 2,
            name: 'Sea Pioneer',
            type: 'Tanker',
            company: 'Maritime Solutions Inc',
            status: 'Active',
            imo: 'IMO2345678'
        },
        {
            id: 3,
            name: 'Wave Rider',
            type: 'Container Ship',
            company: 'Global Fleet Management',
            status: 'Maintenance',
            imo: 'IMO3456789'
        },
        {
            id: 4,
            name: 'Deep Blue',
            type: 'Bulk Carrier',
            company: 'Ocean Shipping Ltd',
            status: 'Active',
            imo: 'IMO4567890'
        },
        {
            id: 5,
            name: 'Star Navigator',
            type: 'Passenger Ship',
            company: 'Maritime Solutions Inc',
            status: 'Active',
            imo: 'IMO5678901'
        }
    ]);

    const handleCreateVessel = () => {
        if (onNavigateToCreate) {
            onNavigateToCreate();
        }
    };

    const handleViewDetail = (vesselId: number) => {
        if (onNavigateToDetail) {
            onNavigateToDetail(vesselId);
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

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Total Vessels</h3>
                    <p className="text-2xl font-bold text-gray-900">{vessels.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Active</h3>
                    <p className="text-2xl font-bold text-green-600">{vessels.filter(v => v.status === 'Active').length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Maintenance</h3>
                    <p className="text-2xl font-bold text-yellow-600">{vessels.filter(v => v.status === 'Maintenance').length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Inactive</h3>
                    <p className="text-2xl font-bold text-red-600">{vessels.filter(v => v.status === 'Inactive').length}</p>
                </div>
            </div>

            {/* Vessels Table */}
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
                        <tr key={vessel.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                <button
                                    onClick={() => handleViewDetail(vessel.id)}
                                    className="text-blue-600 hover:text-blue-900 hover:underline"
                                >
                                    {vessel.name}
                                </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vessel.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vessel.company}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vessel.imo}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      vessel.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : vessel.status === 'Maintenance'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                  }`}>
                    {vessel.status}
                  </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button
                                    onClick={() => handleViewDetail(vessel.id)}
                                    className="text-blue-600 hover:text-blue-900 mr-2"
                                >
                                    View
                                </button>
                                <button className="text-green-600 hover:text-green-900 mr-2">Edit</button>
                                <button className="text-red-600 hover:text-red-900">Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {vessels.length === 0 && (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No vessels found</h3>
                    <p className="text-gray-500 mb-4">Get started by adding your first vessel to the fleet.</p>
                    <button
                        onClick={handleCreateVessel}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Add Your First Vessel
                    </button>
                </div>
            )}
        </div>
    );
}