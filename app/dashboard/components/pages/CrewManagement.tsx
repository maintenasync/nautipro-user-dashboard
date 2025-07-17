// app/dashboard/components/pages/CrewManagement.tsx

'use client';

import { useState } from 'react';
import InviteCrewDialog from '../dialogs/InviteCrewDialog';

interface CrewMember {
    id: number;
    name: string;
    email: string;
    role: string;
    vessel: string;
    startDate: string;
    status: string;
    avatar?: string;
}

export default function CrewManagement() {
    const [crewMembers, setCrewMembers] = useState<CrewMember[]>([
        { id: 1, name: 'John Smith', email: 'john.smith@maritime.com', role: 'Captain', vessel: 'Ocean Explorer', startDate: '2023-01-15', status: 'Active' },
        { id: 2, name: 'Maria Santos', email: 'maria.santos@maritime.com', role: 'Chief Engineer', vessel: 'Ocean Explorer', startDate: '2023-02-20', status: 'Active' },
        { id: 3, name: 'Ahmed Hassan', email: 'ahmed.hassan@maritime.com', role: 'Crew Deck', vessel: 'Sea Pioneer', startDate: '2023-03-10', status: 'Active' },
        { id: 4, name: 'Robert Johnson', email: 'robert.johnson@maritime.com', role: 'Superintendent', vessel: 'Wave Rider', startDate: '2023-01-25', status: 'On Leave' },
        { id: 5, name: 'Sarah Connor', email: 'sarah.connor@maritime.com', role: 'Chief Officer', vessel: 'Ocean Explorer', startDate: '2023-04-05', status: 'Active' },
        { id: 6, name: 'David Wilson', email: 'david.wilson@maritime.com', role: 'Crew Engine', vessel: 'Sea Pioneer', startDate: '2023-02-15', status: 'Active' },
        { id: 7, name: 'Lisa Zhang', email: 'lisa.zhang@maritime.com', role: 'Safety Officer', vessel: 'Wave Rider', startDate: '2023-03-20', status: 'Inactive' },
        { id: 8, name: 'Carlos Rodriguez', email: 'carlos.rodriguez@maritime.com', role: 'Crew Deck', vessel: 'Deep Blue', startDate: '2023-04-10', status: 'Active' },
    ]);

    const [filters, setFilters] = useState({
        vessel: '',
        role: '',
        status: '',
        search: '',
    });

    const [showInviteDialog, setShowInviteDialog] = useState(false);

    // Available vessels for filter
    const vessels = ['All Vessels', 'Ocean Explorer', 'Sea Pioneer', 'Wave Rider', 'Deep Blue', 'Star Navigator'];

    // Available roles for filter
    const roles = [
        'All Roles',
        'Captain',
        'Chief Engineer',
        'Chief Officer',
        'Crew Deck',
        'Crew Engine',
        'Superintendent',
        'Safety Officer',
        'Radio Officer',
        'Bosun',
        'Able Seaman',
        'Ordinary Seaman',
        'Cook',
        'Steward'
    ];

    const statuses = ['All Status', 'Active', 'On Leave', 'Inactive'];

    // Filter crew members
    const filteredCrewMembers = crewMembers.filter(member => {
        const matchesVessel = !filters.vessel || filters.vessel === 'All Vessels' || member.vessel === filters.vessel;
        const matchesRole = !filters.role || filters.role === 'All Roles' || member.role === filters.role;
        const matchesStatus = !filters.status || filters.status === 'All Status' || member.status === filters.status;
        const matchesSearch = !filters.search ||
            member.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            member.email.toLowerCase().includes(filters.search.toLowerCase());

        return matchesVessel && matchesRole && matchesStatus && matchesSearch;
    });

    const handleFilterChange = (filterType: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'On Leave':
                return 'bg-yellow-100 text-yellow-800';
            case 'Inactive':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
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
        // You can refresh the crew list here if needed
        // For now, we'll just close the dialog
        console.log('Invitation sent successfully');
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Crew Management</h1>
                <button
                    onClick={() => setShowInviteDialog(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    <span>Invite New Crew Member</span>
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Total Crew</h3>
                    <p className="text-2xl font-bold text-gray-900">{crewMembers.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Active</h3>
                    <p className="text-2xl font-bold text-green-600">{crewMembers.filter(c => c.status === 'Active').length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">On Leave</h3>
                    <p className="text-2xl font-bold text-yellow-600">{crewMembers.filter(c => c.status === 'On Leave').length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Inactive</h3>
                    <p className="text-2xl font-bold text-red-600">{crewMembers.filter(c => c.status === 'Inactive').length}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Filters:</span>
                    </div>

                    {/* Search */}
                    <div className="flex-1 min-w-48">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Vessel Filter */}
                    <div>
                        <select
                            value={filters.vessel}
                            onChange={(e) => handleFilterChange('vessel', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {vessels.map(vessel => (
                                <option key={vessel} value={vessel === 'All Vessels' ? '' : vessel}>
                                    {vessel}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Role Filter */}
                    <div>
                        <select
                            value={filters.role}
                            onChange={(e) => handleFilterChange('role', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {roles.map(role => (
                                <option key={role} value={role === 'All Roles' ? '' : role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {statuses.map(status => (
                                <option key={status} value={status === 'All Status' ? '' : status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Clear Filters */}
                    <button
                        onClick={clearFilters}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        Clear Filters
                    </button>
                </div>

                {/* Active Filters Display */}
                {(filters.vessel || filters.role || filters.status || filters.search) && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {filters.search && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: "{filters.search}"
                <button
                    onClick={() => handleFilterChange('search', '')}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
                        )}
                        {filters.vessel && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Vessel: {filters.vessel}
                                <button
                                    onClick={() => handleFilterChange('vessel', '')}
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                >
                  ×
                </button>
              </span>
                        )}
                        {filters.role && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Role: {filters.role}
                                <button
                                    onClick={() => handleFilterChange('role', '')}
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                >
                  ×
                </button>
              </span>
                        )}
                        {filters.status && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Status: {filters.status}
                                <button
                                    onClick={() => handleFilterChange('status', '')}
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                >
                  ×
                </button>
              </span>
                        )}
                    </div>
                )}
            </div>

            {/* Results Summary */}
            <div className="mb-4">
                <p className="text-sm text-gray-600">
                    Showing {filteredCrewMembers.length} of {crewMembers.length} crew members
                </p>
            </div>

            {/* Crew Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vessel</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCrewMembers.map((crew) => (
                        <tr key={crew.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {crew.name.split(' ').map(n => n[0]).join('')}
                        </span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{crew.name}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{crew.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{crew.role}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{crew.vessel}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{crew.startDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(crew.status)}`}>
                    {crew.status}
                  </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                                <button className="text-green-600 hover:text-green-900 mr-3">Edit</button>
                                <button className="text-red-600 hover:text-red-900">Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Empty State */}
                {filteredCrewMembers.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No crew members found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Try adjusting your filters or invite new crew members.
                        </p>
                        <button
                            onClick={() => setShowInviteDialog(true)}
                            className="mt-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Invite New Crew Member
                        </button>
                    </div>
                )}
            </div>

            {/* Invite Crew Dialog */}
            <InviteCrewDialog
                isOpen={showInviteDialog}
                onClose={() => setShowInviteDialog(false)}
                onSuccess={handleInviteSuccess}
            />
        </div>
    );
}