// app/dashboard/components/pages/Vessels.tsx

'use client';

import { useState } from 'react';
import CreateVesselDialog from '../dialogs/CreateVesselDialog';
import VesselDetailDialog from '../dialogs/VesselDetailDialog';
import { useAllVessels} from '@/app/hooks/useApiQuery';

export default function Vessels() {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [selectedVesselId, setSelectedVesselId] = useState<string | null>(null);

    // Fetch vessels data
    const { data: vessels = [], isLoading, error, refetch } = useAllVessels();

    const handleCreateVessel = () => {
        setIsCreateDialogOpen(true);
    };

    const handleViewVesselDetail = (vesselId: string) => {
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

    const handleSubmitVessel = async (vesselData: { name: string; vesselType: string; company: string; imo: string; }) => {
        // TODO: Implement create vessel API call
        console.log('Creating vessel:', vesselData);

        // For now, just close dialog and refetch
        setIsCreateDialogOpen(false);
        refetch();
    };

    const handleEditVessel = (vesselId: string) => {
        console.log('Edit vessel:', vesselId);
        // TODO: Implement edit functionality
        setIsDetailDialogOpen(false);
        setSelectedVesselId(null);
    };

    const handleDeleteVessel = (vesselId: string) => {
        if (window.confirm('Are you sure you want to delete this vessel?')) {
            // TODO: Implement delete vessel API call
            console.log('Delete vessel:', vesselId);
            refetch();
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

    // Loading state
    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 [data-theme='dark']_&:text-white">Vessels</h1>
                        <p className="text-gray-600 [data-theme='dark']_&:text-gray-400 mt-1">Manage your fleet vessels</p>
                    </div>
                </div>

                {/* Loading Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse [data-theme='dark']_&:bg-gray-800">
                            <div className="h-4 bg-gray-200 rounded mb-2 [data-theme='dark']_&:bg-gray-700"></div>
                            <div className="h-8 bg-gray-200 rounded [data-theme='dark']_&:bg-gray-700"></div>
                        </div>
                    ))}
                </div>

                {/* Loading Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden [data-theme='dark']_&:bg-gray-800">
                    <div className="p-6">
                        <div className="h-6 bg-gray-200 rounded mb-4 [data-theme='dark']_&:bg-gray-700"></div>
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-4 bg-gray-200 rounded [data-theme='dark']_&:bg-gray-700"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
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

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 [data-theme='dark']_&:bg-red-900 [data-theme='dark']_&:border-red-700">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800 [data-theme='dark']_&:text-red-200">
                                Error loading vessels
                            </h3>
                            <div className="mt-2 text-sm text-red-700 [data-theme='dark']_&:text-red-300">
                                <p>Failed to fetch vessels data. Please check your connection and try again.</p>
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={() => refetch()}
                                    className="bg-red-100 text-red-800 px-3 py-2 text-sm rounded-md hover:bg-red-200 [data-theme='dark']_&:bg-red-800 [data-theme='dark']_&:text-red-200 [data-theme='dark']_&:hover:bg-red-700"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
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
                                <tr key={vessel.id} className="hover:bg-gray-50 [data-theme='dark']_&:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                {vessel.image ? (
                                                    <img className="h-10 w-10 rounded-lg object-cover" src={vessel.image} alt={vessel.name} />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-lg bg-gray-300 flex items-center justify-center [data-theme='dark']_&:bg-gray-600">
                                                        <svg className="h-6 w-6 text-gray-500 [data-theme='dark']_&:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 [data-theme='dark']_&:text-white">{vessel.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 [data-theme='dark']_&:text-white">{vessel.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">{vessel.company}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 [data-theme='dark']_&:text-white">{vessel.imo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vessel.status)}`}>
                        {vessel.status}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleViewVesselDetail(vessel.id)}
                                            className="text-blue-600 hover:text-blue-900 [data-theme='dark']_&:text-blue-400 [data-theme='dark']_&:hover:text-blue-300 mr-4"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleEditVessel(vessel.id)}
                                            className="text-indigo-600 hover:text-indigo-900 [data-theme='dark']_&:text-indigo-400 [data-theme='dark']_&:hover:text-indigo-300 mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteVessel(vessel.id)}
                                            className="text-red-600 hover:text-red-900 [data-theme='dark']_&:text-red-400 [data-theme='dark']_&:hover:text-red-300"
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
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 [data-theme='dark']_&:text-white">No vessels</h3>
                    <p className="mt-1 text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">Get started by adding your first vessel.</p>
                    <div className="mt-6">
                        <button
                            onClick={handleCreateVessel}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <svg className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add New Vessel
                        </button>
                    </div>
                </div>
            )}

            {/* Dialogs */}
            {isCreateDialogOpen && (
                <CreateVesselDialog
                    isOpen={isCreateDialogOpen}
                    onClose={handleCloseCreateDialog}
                    onSubmit={handleSubmitVessel}
                />
            )}

            {isDetailDialogOpen && selectedVesselId && (
                <VesselDetailDialog
                    isOpen={isDetailDialogOpen}
                    onClose={handleCloseDetailDialog}
                    vesselId={selectedVesselId}
                    onEdit={handleEditVessel}
                    onDelete={handleDeleteVessel}
                />
            )}
        </div>
    );
}