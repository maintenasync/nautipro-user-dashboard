// app/dashboard/components/pages/CrewManagement.tsx

'use client';

import { useState } from 'react';
import InviteCrewDialog from '../dialogs/InviteCrewDialog';
import { useFilteredCrews, useAllVessels, useCompanies } from '@/app/hooks/useApiQuery';
import Image from "next/image";

export default function CrewManagement() {
    const [filters, setFilters] = useState({
        vessel: '',
        role: '',
        status: '',
        search: '',
    });

    const [showInviteDialog, setShowInviteDialog] = useState(false);

    // Fetch data using custom hooks
    const { data: crewMembers = [], isLoading, error, refetch } = useFilteredCrews(filters);
    const { data: vessels = [] } = useAllVessels();
    const { data: companies = [] } = useCompanies();

    // Available vessels for filter (from API data)
    const availableVessels = ['All Vessels', ...vessels.map(v => v.name)];

    // Available roles for filter (from API data - get unique roles)
    const availableRoles = [
        'All Roles',
        ...Array.from(new Set(crewMembers.map(crew => crew.role))).sort()
    ];

    const statuses = ['All Status', 'Active', 'Inactive'];

    const handleFilterChange = (filterType: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800 [data-theme=\'dark\']_&:bg-green-900 [data-theme=\'dark\']_&:text-green-200';
            case 'Inactive':
                return 'bg-red-100 text-red-800 [data-theme=\'dark\']_&:bg-red-900 [data-theme=\'dark\']_&:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 [data-theme=\'dark\']_&:bg-gray-700 [data-theme=\'dark\']_&:text-gray-200';
        }
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            vessel: '',
            role: '',
            status: '',
            search: '',
        });
    };

    // Handle successful invitation
    const handleInviteSuccess = () => {
        console.log('Invitation sent successfully');
        refetch(); // Refresh crew data
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 [data-theme='dark']_&:text-white">Crew Management</h1>
                        <p className="text-gray-600 [data-theme='dark']_&:text-gray-400 mt-1">Manage your crew members</p>
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
                        <h1 className="text-2xl font-bold text-gray-800 [data-theme='dark']_&:text-white">Crew Management</h1>
                        <p className="text-gray-600 [data-theme='dark']_&:text-gray-400 mt-1">Manage your crew members</p>
                    </div>
                    <button
                        onClick={() => setShowInviteDialog(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-150 flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Invite Crew Member</span>
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
                                Error loading crew members
                            </h3>
                            <div className="mt-2 text-sm text-red-700 [data-theme='dark']_&:text-red-300">
                                <p>Failed to fetch crew data. Please check your connection and try again.</p>
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
                    <h1 className="text-2xl font-bold text-gray-800 [data-theme='dark']_&:text-white">Crew Management</h1>
                    <p className="text-gray-600 [data-theme='dark']_&:text-gray-400 mt-1">Manage your crew members</p>
                </div>
                <button
                    onClick={() => setShowInviteDialog(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-150 flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Invite Crew Member</span>
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Total Crew Members</h3>
                    <p className="text-2xl font-bold text-gray-900 [data-theme='dark']_&:text-white">{crewMembers.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Active</h3>
                    <p className="text-2xl font-bold text-green-600">{crewMembers.filter(c => c.status === 'Active').length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Vessels</h3>
                    <p className="text-2xl font-bold text-blue-600">{vessels.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Companies</h3>
                    <p className="text-2xl font-bold text-purple-600">{companies.length}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6 [data-theme='dark']_&:bg-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Search */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 [data-theme='dark']_&:text-gray-300 mb-1">
                            Search
                        </label>
                        <input
                            type="text"
                            placeholder="Search name or email..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:border-gray-600 [data-theme='dark']_&:text-white"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:border-gray-600 [data-theme='dark']_&:text-white"
                        >
                            <option value="">All Vessels</option>
                            {availableVessels.slice(1).map((vessel) => (
                                <option key={vessel} value={vessel}>{vessel}</option>
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:border-gray-600 [data-theme='dark']_&:text-white"
                        >
                            <option value="">All Roles</option>
                            {availableRoles.slice(1).map((role) => (
                                <option key={role} value={role}>{role}</option>
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:border-gray-600 [data-theme='dark']_&:text-white"
                        >
                            <option value="">All Status</option>
                            {statuses.slice(1).map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex items-end">
                        <button
                            onClick={clearFilters}
                            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 [data-theme='dark']_&:bg-gray-600 [data-theme='dark']_&:text-gray-200 [data-theme='dark']_&:border-gray-500 [data-theme='dark']_&:hover:bg-gray-500"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Crew Members Table */}
            {crewMembers.length > 0 ? (
                <div className="bg-white rounded-lg shadow overflow-hidden [data-theme='dark']_&:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 [data-theme='dark']_&:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Vessel</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Start Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 [data-theme='dark']_&:bg-gray-800 [data-theme='dark']_&:divide-gray-600">
                            {crewMembers.map((crew) => (
                                <tr key={crew.id} className="hover:bg-gray-50 [data-theme='dark']_&:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                {crew.avatar ? (
                                                    <img className="h-10 w-10 rounded-full object-cover" src={crew.avatar} alt={crew.name} />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center [data-theme='dark']_&:bg-gray-600">
                              <span className="text-sm font-medium text-gray-700 [data-theme='dark']_&:text-gray-300">
                                {crew.name.split(' ').map(n => n[0]).join('')}
                              </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 [data-theme='dark']_&:text-white">{crew.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">{crew.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 [data-theme='dark']_&:text-white">{crew.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">{crew.vessel}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">{crew.startDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(crew.status)}`}>
                        {crew.status}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-900 [data-theme='dark']_&:text-blue-400 [data-theme='dark']_&:hover:text-blue-300 mr-4">
                                            View
                                        </button>
                                        <button className="text-indigo-600 hover:text-indigo-900 [data-theme='dark']_&:text-indigo-400 [data-theme='dark']_&:hover:text-indigo-300 mr-4">
                                            Edit
                                        </button>
                                        <button className="text-red-600 hover:text-red-900 [data-theme='dark']_&:text-red-400 [data-theme='dark']_&:hover:text-red-300">
                                            Remove
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 [data-theme='dark']_&:text-white">No crew members</h3>
                    <p className="mt-1 text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">Get started by inviting your first crew member.</p>
                    <div className="mt-6">
                        <button
                            onClick={() => setShowInviteDialog(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <svg className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Invite Crew Member
                        </button>
                    </div>
                </div>
            )}

            {/* Invite Crew Dialog */}
            <InviteCrewDialog
                isOpen={showInviteDialog}
                onClose={() => setShowInviteDialog(false)}
                onSuccess={handleInviteSuccess}
            />
        </div>
    );
}