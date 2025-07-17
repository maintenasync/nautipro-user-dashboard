// app/dashboard/components/pages/Companies.tsx

'use client';

import { useState } from 'react';
import CreateCompanyDialog from '../dialogs/CreateCompanyDialog';
import CompanyDetailDialog from '../dialogs/CompanyDetailDialog';
import {CompanyFormData} from "@/app/types/company";

interface Company {
    id: number;
    name: string;
    location: string;
    vessels: number;
    created: string;
}

export default function Companies() {
    const [companies, setCompanies] = useState<Company[]>([
        { id: 1, name: 'Ocean Shipping Ltd', location: 'Singapore', vessels: 5, created: '2024-01-15' },
        { id: 2, name: 'Maritime Solutions Inc', location: 'Hong Kong', vessels: 3, created: '2024-02-20' },
        { id: 3, name: 'Global Fleet Management', location: 'Indonesia', vessels: 4, created: '2024-03-10' },
    ]);

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);

    const handleCreateCompany = () => {
        setIsCreateDialogOpen(true);
    };

    const handleViewCompanyDetail = (companyId: number) => {
        setSelectedCompanyId(companyId);
        setIsDetailDialogOpen(true);
    };

    const handleCloseCreateDialog = () => {
        setIsCreateDialogOpen(false);
    };

    const handleCloseDetailDialog = () => {
        setIsDetailDialogOpen(false);
        setSelectedCompanyId(null);
    };

    const handleSubmitCompany = async (companyData: CompanyFormData) => {
        // Simulate API call
        console.log('Creating company:', companyData);

        // Create new company object
        const newCompany: Company = {
            id: companies.length + 1,
            name: companyData.name,
            location: companyData.city + ', ' + companyData.country,
            vessels: 0,
            created: "",
        };

        // Add to companies list
        setCompanies(prev => [...prev, newCompany]);
    };

    const handleEditCompany = (companyId: number) => {
        console.log('Edit company:', companyId);
        // Implement edit functionality
        setIsDetailDialogOpen(false);
        setSelectedCompanyId(null);
        // You can open edit dialog here
    };

    const handleDeleteCompany = (companyId: number) => {
        if (window.confirm('Are you sure you want to delete this company?')) {
            setCompanies(prev => prev.filter(company => company.id !== companyId));
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 [data-theme='dark']_&:text-white">Companies</h1>
                    <p className="text-gray-600 [data-theme='dark']_&:text-gray-400 mt-1">Manage your fleet companies</p>
                </div>
                <button
                    onClick={handleCreateCompany}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-150 flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Create New Company</span>
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Total Companies</h3>
                    <p className="text-2xl font-bold text-gray-900 [data-theme='dark']_&:text-white">{companies.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Total Vessels</h3>
                    <p className="text-2xl font-bold text-blue-600">{companies.reduce((sum, company) => sum + company.vessels, 0)}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Active This Month</h3>
                    <p className="text-2xl font-bold text-green-600">
                        {companies.filter(c => new Date(c.created).getMonth() === new Date().getMonth()).length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Avg Vessels/Company</h3>
                    <p className="text-2xl font-bold text-purple-600">
                        {companies.length > 0 ? Math.round(companies.reduce((sum, company) => sum + company.vessels, 0) / companies.length) : 0}
                    </p>
                </div>
            </div>

            {/* Companies Grid */}
            {companies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map((company) => (
                        <div key={company.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow [data-theme='dark']_&:bg-gray-800 cursor-pointer">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1" onClick={() => handleViewCompanyDetail(company.id)}>
                                    <h3 className="text-lg font-semibold text-gray-800 [data-theme='dark']_&:text-white mb-2 hover:text-blue-600 [data-theme='dark']_&:hover:text-blue-400 transition-colors duration-150">
                                        {company.name}
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-gray-600 [data-theme='dark']_&:text-gray-400">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {company.location}
                                        </div>
                                        <div className="flex items-center text-gray-600 [data-theme='dark']_&:text-gray-400">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            {company.vessels} Vessels
                                        </div>
                                        <div className="flex items-center text-gray-600 [data-theme='dark']_&:text-gray-400">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
                                            </svg>
                                            Created: {new Date(company.created).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                {/* Company Avatar */}
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-semibold text-lg">
                                        {company.name.split(' ').map(word => word[0]).join('').substring(0, 2)}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200 [data-theme='dark']_&:border-gray-600">
                                <button
                                    onClick={() => handleViewCompanyDetail(company.id)}
                                    className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors duration-150 [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:text-gray-200 [data-theme='dark']_&:hover:bg-gray-600"
                                >
                                    View Details
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditCompany(company.id);
                                    }}
                                    className="bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors duration-150 [data-theme='dark']_&:bg-blue-900 [data-theme='dark']_&:text-blue-200 [data-theme='dark']_&:hover:bg-blue-800"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteCompany(company.id);
                                    }}
                                    className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition-colors duration-150 [data-theme='dark']_&:bg-red-900 [data-theme='dark']_&:text-red-200 [data-theme='dark']_&:hover:bg-red-800"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="bg-white rounded-lg shadow p-8 text-center [data-theme='dark']_&:bg-gray-800">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 [data-theme='dark']_&:text-white mb-2">No companies found</h3>
                    <p className="text-gray-500 [data-theme='dark']_&:text-gray-400 mb-4">Get started by creating your first company to manage vessels.</p>
                    <button
                        onClick={handleCreateCompany}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-150"
                    >
                        Create Your First Company
                    </button>
                </div>
            )}

            {/* Create Company Dialog */}
            <CreateCompanyDialog
                isOpen={isCreateDialogOpen}
                onClose={handleCloseCreateDialog}
                onSubmit={handleSubmitCompany}
            />

            {/* Company Detail Dialog */}
            <CompanyDetailDialog
                isOpen={isDetailDialogOpen}
                companyId={selectedCompanyId}
                onClose={handleCloseDetailDialog}
                onEdit={handleEditCompany}
            />
        </div>
    );
}