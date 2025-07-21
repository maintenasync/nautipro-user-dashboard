// app/dashboard/components/pages/Vessels.tsx - Updated with full CRUD

'use client';

import { useState } from 'react';
import CreateVesselDialog from '../dialogs/CreateVesselDialog';
import EditVesselDialog from '../dialogs/EditVesselDialog';
import VesselDetailDialog from '../dialogs/VesselDetailDialog';
import ConfirmDeleteDialog from '../dialogs/ConfirmDeleteDialog';
import { useAllVessels, useDeleteVessel, useCompanies } from '@/app/hooks/useApiQuery';
import type { VesselUI } from '@/app/types/api';

export default function Vessels() {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedVesselId, setSelectedVesselId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [companyFilter, setCompanyFilter] = useState('All Companies');
    const [typeFilter, setTypeFilter] = useState('All Types');
    const [statusFilter, setStatusFilter] = useState('All Status');

    // Fetch data
    const { data: vessels = [], isLoading, error, refetch } = useAllVessels();
    const { data: companies = [] } = useCompanies();
    const deleteVesselMutation = useDeleteVessel();

    // Get filter options
    const availableCompanies = ['All Companies', ...Array.from(new Set(vessels.map(v => v.company)))];
    const availableTypes = ['All Types', ...Array.from(new Set(vessels.map(v => v.type)))];
    const availableStatuses = ['All Status', 'Active', 'Inactive'];

    // Filter vessels
    const filteredVessels = vessels.filter(vessel => {
        const matchesSearch =
            vessel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vessel.imo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vessel.company.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCompany = companyFilter === 'All Companies' || vessel.company === companyFilter;
        const matchesType = typeFilter === 'All Types' || vessel.type === typeFilter;
        const matchesStatus = statusFilter === 'All Status' || vessel.status === statusFilter;

        return matchesSearch && matchesCompany && matchesType && matchesStatus;
    });

    const selectedVessel = vessels.find(v => v.id === selectedVesselId) || null;

    const handleCreateVessel = () => {
        setIsCreateDialogOpen(true);
    };

    const handleEditVessel = (vesselId: string) => {
        setSelectedVesselId(vesselId);
        setIsEditDialogOpen(true);
    };

    const handleViewVesselDetail = (vesselId: string) => {
        setSelectedVesselId(vesselId);
        setIsDetailDialogOpen(true);
    };

    const handleDeleteVessel = (vesselId: string) => {
        setSelectedVesselId(vesselId);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedVesselId) return;

        try {
            await deleteVesselMutation.mutateAsync(selectedVesselId);
            setIsDeleteDialogOpen(false);
            setSelectedVesselId(null);
            refetch();
        } catch (error: any) {
            // Error is handled by the mutation - will be shown in the dialog
            console.error('Delete failed:', error);
        }
    };

    const handleCloseDialogs = () => {
        setIsCreateDialogOpen(false);
        setIsEditDialogOpen(false);
        setIsDetailDialogOpen(false);
        setIsDeleteDialogOpen(false);
        setSelectedVesselId(null);
    };

    const handleSuccess = () => {
        refetch();
        handleCloseDialogs();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800 [data-theme=\'dark\']_&:bg-green-900 [data-theme=\'dark\']_&:text-green-300';
            case 'Inactive':
                return 'bg-red-100 text-red-800 [data-theme=\'dark\']_&:bg-red-900 [data-theme=\'dark\']_&:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 [data-theme=\'dark\']_&:bg-gray-700 [data-theme=\'dark\']_&:text-gray-300';
        }
    };

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded [data-theme='dark']_&:bg-red-900 [data-theme='dark']_&:border-red-700 [data-theme='dark']_&:text-red-300">
                    Error loading vessels: {error.message}
                    <button
                        onClick={() => refetch()}
                        className="ml-2 underline hover:no-underline"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 [data-theme='dark']_&:text-white">
                        Vessels
                    </h1>
                    <p className="text-gray-600 [data-theme='dark']_&:text-gray-300">
                        Manage your fleet of vessels and their specifications
                    </p>
                </div>
                <button
                    onClick={handleCreateVessel}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Vessel</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white [data-theme='dark']_&:bg-gray-800 rounded-lg shadow mb-6 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search vessels by name, IMO, or company..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md [data-theme='dark']_&:border-gray-600 [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:text-white"
                            />
                            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Company Filter */}
                    <div>
                        <select
                            value={companyFilter}
                            onChange={(e) => setCompanyFilter(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md [data-theme='dark']_&:border-gray-600 [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:text-white"
                        >
                            {availableCompanies.map(company => (
                                <option key={company} value={company}>
                                    {company}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Type Filter */}
                    <div>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md [data-theme='dark']_&:border-gray-600 [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:text-white"
                        >
                            {availableTypes.map(type => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md [data-theme='dark']_&:border-gray-600 [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:text-white"
                        >
                            {availableStatuses.map(status => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Filter Summary */}
                <div className="mt-3 flex items-center justify-between text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">
                    <div>
                        {isLoading ? 'Loading...' : `${filteredVessels.length} vessels`}
                        {filteredVessels.length !== vessels.length && ` of ${vessels.length} total`}
                    </div>
                    {(searchTerm || companyFilter !== 'All Companies' || typeFilter !== 'All Types' || statusFilter !== 'All Status') && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setCompanyFilter('All Companies');
                                setTypeFilter('All Types');
                                setStatusFilter('All Status');
                            }}
                            className="text-blue-600 hover:text-blue-800 [data-theme='dark']_&:text-blue-400 [data-theme='dark']_&:hover:text-blue-300"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            {/* Vessels Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="bg-white [data-theme='dark']_&:bg-gray-800 rounded-lg shadow animate-pulse">
                            <div className="aspect-video bg-gray-200 [data-theme='dark']_&:bg-gray-600 rounded-t-lg"></div>
                            <div className="p-4">
                                <div className="h-4 bg-gray-200 [data-theme='dark']_&:bg-gray-600 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 [data-theme='dark']_&:bg-gray-600 rounded mb-4"></div>
                                <div className="flex justify-between">
                                    <div className="h-3 bg-gray-200 [data-theme='dark']_&:bg-gray-600 rounded w-1/3"></div>
                                    <div className="h-3 bg-gray-200 [data-theme='dark']_&:bg-gray-600 rounded w-1/4"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredVessels.length === 0 ? (
                <div className="bg-white [data-theme='dark']_&:bg-gray-800 rounded-lg shadow p-8 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 [data-theme='dark']_&:text-white">No vessels found</h3>
                    <p className="mt-1 text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">
                        {searchTerm || companyFilter !== 'All Companies' || typeFilter !== 'All Types' || statusFilter !== 'All Status'
                            ? 'Try adjusting your filters to find vessels.'
                            : 'Get started by adding your first vessel to the fleet.'
                        }
                    </p>
                    {!(searchTerm || companyFilter !== 'All Companies' || typeFilter !== 'All Types' || statusFilter !== 'All Status') && (
                        <div className="mt-6">
                            <button
                                onClick={handleCreateVessel}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add Vessel
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVessels.map((vessel) => (
                        <div key={vessel.id} className="bg-white [data-theme='dark']_&:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow">
                            {/* Vessel Image */}
                            <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden [data-theme='dark']_&:bg-gray-700">
                                {vessel.image ? (
                                    <img
                                        src={vessel.image}
                                        alt={vessel.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                {/* Vessel Header */}
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold text-gray-800 [data-theme='dark']_&:text-white truncate">
                                        {vessel.name}
                                    </h3>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vessel.status)}`}>
                                        {vessel.status}
                                    </span>
                                </div>

                                {/* Vessel Info */}
                                <div className="space-y-1 mb-4 text-sm text-gray-600 [data-theme='dark']_&:text-gray-400">
                                    <div className="flex justify-between">
                                        <span>Type:</span>
                                        <span className="font-medium">{vessel.type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>IMO:</span>
                                        <span className="font-medium">{vessel.imo}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Company:</span>
                                        <span className="font-medium truncate ml-2">{vessel.company}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleViewVesselDetail(vessel.id)}
                                        className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:text-gray-300 [data-theme='dark']_&:hover:bg-gray-600"
                                    >
                                        Details
                                    </button>
                                    <button
                                        onClick={() => handleEditVessel(vessel.id)}
                                        className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm [data-theme='dark']_&:bg-blue-900 [data-theme='dark']_&:text-blue-300 [data-theme='dark']_&:hover:bg-blue-800"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteVessel(vessel.id)}
                                        className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm [data-theme='dark']_&:bg-red-900 [data-theme='dark']_&:text-red-300 [data-theme='dark']_&:hover:bg-red-800"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Dialogs */}
            <CreateVesselDialog
                isOpen={isCreateDialogOpen}
                onClose={handleCloseDialogs}
                onSuccess={handleSuccess}
            />

            <EditVesselDialog
                isOpen={isEditDialogOpen}
                vessel={selectedVessel}
                onClose={handleCloseDialogs}
                onSuccess={handleSuccess}
            />

            <VesselDetailDialog
                isOpen={isDetailDialogOpen}
                vesselId={selectedVesselId}
                onClose={handleCloseDialogs}
                onEdit={(vesselId) => {
                    setIsDetailDialogOpen(false);
                    handleEditVessel(vesselId);
                }}
                onDelete={(vesselId) => {
                    setIsDetailDialogOpen(false);
                    handleDeleteVessel(vesselId);
                }}
            />

            <ConfirmDeleteDialog
                isOpen={isDeleteDialogOpen}
                title="Delete Vessel"
                message={`Are you sure you want to delete "${selectedVessel?.name}"? This action cannot be undone and will affect all associated crew members and licenses.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseDialogs}
                isLoading={deleteVesselMutation.isPending}
                error={deleteVesselMutation.error?.message}
            />
        </div>
    );
}