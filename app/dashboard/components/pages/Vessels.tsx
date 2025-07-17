// app/dashboard/components/pages/Vessels.tsx

'use client';

import { useState } from 'react';
import CreateVesselDialog from '../dialogs/CreateVesselDialog';
import VesselDetailDialog from '../dialogs/VesselDetailDialog';

interface Vessel {
    id: number;
    name: string;
    type: string;
    company: string;
    status: string;
    imo: string;
}

export default function Vessels() {
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

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [selectedVesselId, setSelectedVesselId] = useState<number | null>(null);

    const handleCreateVessel = () => {
        setIsCreateDialogOpen(true);
    };

    const handleViewVesselDetail = (vesselId: number) => {
        setSelectedVesselId(vesselId);
        setIsDetailDialogOpen(true);
    };

    const handleCloseCreateDialog = () => {
        setIsCreateDialogOpen(false);
    };

    const handleCloseDetailDialog = () => {
        setIsDetailDialogOpen(false);
        setSelectedVesselId(null);
    };

    const handleSubmitVessel = async (vesselData: any) => {
        // Simulate API call
        console.log('Creating vessel:', vesselData);

        // Create new vessel object
        const newVessel: Vessel = {
            id: vessels.length + 1,
            name: vesselData.name,
            type: vesselData.vesselType,
            company: vesselData.company || 'Unassigned',
            status: 'Active',
            imo: vesselData.imo || `IMO${Math.floor(Math.random() * 9000000) + 1000000}`
        };

        // Add to vessels list
        setVessels(prev => [...prev, newVessel]);
    };

    const handleEditVessel = (vesselId: number) => {
        console.log('Edit vessel:', vesselId);
        // Implement edit functionality
        setIsDetailDialogOpen(false);
        setSelectedVesselId(null);
        // You can open edit dialog here
    };

    const handleDeleteVessel = (vesselId: number) => {
        if (window.confirm('Are you sure you want to delete this vessel?')) {
            setVessels(prev => prev.filter(vessel => vessel.id !== vesselId));
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800 [data-theme=\'dark\']_&:bg-green-900 [data-theme=\'dark\']_&:text-green-200';
            case 'Maintenance':
                return 'bg-yellow-100 text-yellow-800 [data-theme=\'dark\']_&:bg-yellow-900 [data-theme=\'dark\']_&:text-yellow-200';
            case 'Inactive':
                return 'bg-red-100 text-red-800 [data-theme=\'dark\']_&:bg-red-900 [data-theme=\'dark\']_&:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 [data-theme=\'dark\']_&:bg-gray-700 [data-theme=\'dark\']_&:text-gray-200';
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 [data-theme='dark']_&:text-white">Vessels</h1>
                    <p className="text-gray-600 [data-theme='dark']_&:text-gray-400 mt-1">Manage your fleet vessels</p>
                </div>
                <button
                    onClick={handleCreateVessel}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-150 flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add New Vessel</span>
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Total Vessels</h3>
                    <p className="text-2xl font-bold text-gray-900 [data-theme='dark']_&:text-white">{vessels.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Active</h3>
                    <p className="text-2xl font-bold text-green-600">{vessels.filter(v => v.status === 'Active').length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Maintenance</h3>
                    <p className="text-2xl font-bold text-yellow-600">{vessels.filter(v => v.status === 'Maintenance').length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Inactive</h3>
                    <p className="text-2xl font-bold text-red-600">{vessels.filter(v => v.status === 'Inactive').length}</p>
                </div>
            </div>

            {/* Vessels Table */}
            {vessels.length > 0 ? (
                <div className="bg-white rounded-lg shadow overflow-hidden [data-theme='dark']_&:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 [data-theme='dark']_&:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Vessel Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Company</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">IMO Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white [data-theme='dark']_&:bg-gray-800 divide-y divide-gray-200 [data-theme='dark']_&:divide-gray-600">
                            {vessels.map((vessel) => (
                                <tr key={vessel.id} className="hover:bg-gray-50 [data-theme='dark']_&:hover:bg-gray-700 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 [data-theme='dark']_&:text-white">
                                        <button
                                            onClick={() => handleViewVesselDetail(vessel.id)}
                                            className="text-blue-600 hover:text-blue-900 hover:underline [data-theme='dark']_&:text-blue-400 [data-theme='dark']_&:hover:text-blue-300 transition-colors duration-150"
                                        >
                                            {vessel.name}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 [data-theme='dark']_&:text-gray-300">{vessel.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 [data-theme='dark']_&:text-gray-300">{vessel.company}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 [data-theme='dark']_&:text-gray-300">{vessel.imo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(vessel.status)}`}>
                                                {vessel.status}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                        <button
                                            onClick={() => handleViewVesselDetail(vessel.id)}
                                            className="text-blue-600 hover:text-blue-900 [data-theme='dark']_&:text-blue-400 [data-theme='dark']_&:hover:text-blue-300 transition-colors duration-150"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleEditVessel(vessel.id)}
                                            className="text-green-600 hover:text-green-900 [data-theme='dark']_&:text-green-400 [data-theme='dark']_&:hover:text-green-300 transition-colors duration-150"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteVessel(vessel.id)}
                                            className="text-red-600 hover:text-red-900 [data-theme='dark']_&:text-red-400 [data-theme='dark']_&:hover:text-red-300 transition-colors duration-150"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Empty State */
                <div className="bg-white rounded-lg shadow p-8 text-center [data-theme='dark']_&:bg-gray-800">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 [data-theme='dark']_&:text-white mb-2">No vessels found</h3>
                    <p className="text-gray-500 [data-theme='dark']_&:text-gray-400 mb-4">Get started by adding your first vessel to the fleet.</p>
                    <button
                        onClick={handleCreateVessel}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-150"
                    >
                        Add Your First Vessel
                    </button>
                </div>
            )}

            {/* Create Vessel Dialog */}
            <CreateVesselDialog
                isOpen={isCreateDialogOpen}
                onClose={handleCloseCreateDialog}
                onSubmit={handleSubmitVessel}
            />

            {/* Vessel Detail Dialog */}
            <VesselDetailDialog
                isOpen={isDetailDialogOpen}
                vesselId={selectedVesselId}
                onClose={handleCloseDetailDialog}
                onEdit={handleEditVessel}
            />
        </div>
    );
}