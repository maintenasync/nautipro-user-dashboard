// app/dashboard/components/pages/CrewManagement.tsx - Updated version

'use client';

import { useState } from 'react';
import InviteCrewDialog from '../dialogs/InviteCrewDialog';
import UpdateCrewDialog from '../dialogs/UpdateCrewDialog';
import { useFilteredCrews, useAllVessels, useCompanies, useRoles } from '@/app/hooks/useApiQuery';
import type { CrewMemberUI } from '@/app/types/api';
import Image from "next/image";

export default function CrewManagement() {
    const [filters, setFilters] = useState({
        vessel: '',
        role: '',
        status: '',
        search: '',
    });

    const [showInviteDialog, setShowInviteDialog] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [selectedCrewMember, setSelectedCrewMember] = useState<CrewMemberUI | null>(null);

    // Fetch data using custom hooks
    const { data: crewMembers = [], isLoading, error, refetch } = useFilteredCrews(filters);
    const { data: vessels = [] } = useAllVessels();
    const { data: companies = [] } = useCompanies();
    const { data: roles = [] } = useRoles();

    // Available vessels for filter (from API data)
    const availableVessels = ['All Vessels', ...vessels.map(v => v.name)];

    // Available roles for filter (from API data)
    const availableRoles = [
        'All Roles',
        ...roles.map(role => role.name)
    ];

    const statuses = ['All Status', 'Active', 'Inactive'];

    const handleFilterChange = (filterType: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const handleUpdateCrew = (crewMember: CrewMemberUI) => {
        setSelectedCrewMember(crewMember);
        setShowUpdateDialog(true);
    };

    const handleCloseUpdateDialog = () => {
        setShowUpdateDialog(false);
        setSelectedCrewMember(null);
    };

    const handleUpdateSuccess = () => {
        refetch(); // Refresh crew data
        setShowUpdateDialog(false);
        setSelectedCrewMember(null);
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
                    Error loading crew data: {error.message}
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
                        Crew Management
                    </h1>
                    <p className="text-gray-600 [data-theme='dark']_&:text-gray-300">
                        Manage vessel crew members and their assignments
                    </p>
                </div>
                <button
                    onClick={() => setShowInviteDialog(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Invite Crew</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white [data-theme='dark']_&:bg-gray-800 rounded-lg shadow mb-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 [data-theme='dark']_&:text-gray-300 mb-1">
                            Search
                        </label>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md [data-theme='dark']_&:border-gray-600 [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:text-white"
                        />
                    </div>

                    {/* Vessel Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 [data-theme='dark']_&:text-gray-300 mb-1">
                            Vessel
                        </label>
                        <select
                            value={filters.vessel}
                            onChange={(e) => handleFilterChange('vessel', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md [data-theme='dark']_&:border-gray-600 [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:text-white"
                        >
                            {availableVessels.map(vessel => (
                                <option key={vessel} value={vessel}>
                                    {vessel}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Role Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 [data-theme='dark']_&:text-gray-300 mb-1">
                            Role
                        </label>
                        <select
                            value={filters.role}
                            onChange={(e) => handleFilterChange('role', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md [data-theme='dark']_&:border-gray-600 [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:text-white"
                        >
                            {availableRoles.map(role => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 [data-theme='dark']_&:text-gray-300 mb-1">
                            Status
                        </label>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md [data-theme='dark']_&:border-gray-600 [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:text-white"
                        >
                            {statuses.map(status => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Crew Members List */}
            <div className="bg-white [data-theme='dark']_&:bg-gray-800 rounded-lg shadow">
                {isLoading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-500 [data-theme='dark']_&:text-gray-400 mt-2">Loading crew members...</p>
                    </div>
                ) : crewMembers.length === 0 ? (
                    <div className="p-8 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 [data-theme='dark']_&:text-white">No crew members found</h3>
                        <p className="mt-1 text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">
                            {Object.values(filters).some(filter => filter && filter !== 'All Vessels' && filter !== 'All Roles' && filter !== 'All Status')
                                ? 'Try adjusting your filters to see more crew members.'
                                : 'Get started by inviting your first crew member.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 [data-theme='dark']_&:divide-gray-700">
                            <thead className="bg-gray-50 [data-theme='dark']_&:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">
                                    Crew Member
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">
                                    Vessel
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">
                                    Start Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white [data-theme='dark']_&:bg-gray-800 divide-y divide-gray-200 [data-theme='dark']_&:divide-gray-700">
                            {crewMembers.map((crew) => (
                                <tr key={crew.id} className="hover:bg-gray-50 [data-theme='dark']_&:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {crew.avatar ? (
                                                <img
                                                    src={crew.avatar}
                                                    alt={crew.name}
                                                    className="h-10 w-10 rounded-full"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-gray-300 [data-theme='dark']_&:bg-gray-600 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-gray-700 [data-theme='dark']_&:text-gray-300">
                                                            {crew.name.charAt(0).toUpperCase()}
                                                        </span>
                                                </div>
                                            )}
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 [data-theme='dark']_&:text-white">
                                                    {crew.name}
                                                </div>
                                                <div className="text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">
                                                    {crew.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 [data-theme='dark']_&:text-white">
                                            {crew.role}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 [data-theme='dark']_&:text-white">
                                            {crew.vessel}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">
                                        {crew.startDate}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(crew.status)}`}>
                                                {crew.status}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleUpdateCrew(crew)}
                                            className="text-indigo-600 hover:text-indigo-900 [data-theme='dark']_&:text-indigo-400 [data-theme='dark']_&:hover:text-indigo-300"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Summary Stats */}
            {!isLoading && crewMembers.length > 0 && (
                <div className="mt-4 text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">
                    Showing {crewMembers.length} crew members
                </div>
            )}

            {/* Dialogs */}
            <InviteCrewDialog
                isOpen={showInviteDialog}
                onClose={() => setShowInviteDialog(false)}
                onSuccess={() => {
                    setShowInviteDialog(false);
                    refetch();
                }}
            />

            <UpdateCrewDialog
                isOpen={showUpdateDialog}
                crewMember={selectedCrewMember}
                onClose={handleCloseUpdateDialog}
                onSuccess={handleUpdateSuccess}
            />
        </div>
    );
}