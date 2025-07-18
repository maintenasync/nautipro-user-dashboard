// app/dashboard/components/pages/Companies.tsx

'use client';

import { useState } from 'react';
import CreateCompanyDialog from '../dialogs/CreateCompanyDialog';
import CompanyDetailDialog from '../dialogs/CompanyDetailDialog';
import { CompanyFormData } from "@/app/types/company";
import { useCompanies } from '@/app/hooks/useApiQuery';
import type { CompanyUI } from '@/app/types/api';

// Extended interface for UI with counts
interface CompanyWithCounts extends CompanyUI {
    vessels: number;
    crews: number;
}

export default function Companies() {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

    // Fetch companies data
    const { data: companiesData, isLoading, error, refetch } = useCompanies();

    // Enhanced companies data with counts (you might want to optimize this)
    const companies: CompanyWithCounts[] = companiesData?.map(company => ({
        ...company,
        vessels: 0, // Will be updated below
        crews: 0,   // Will be updated below
    })) || [];

    const handleCreateCompany = () => {
        setIsCreateDialogOpen(true);
    };

    const handleViewCompanyDetail = (companyId: string) => {
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
        // TODO: Implement create company API call
        console.log('Creating company:', companyData);

        // For now, just close dialog and refetch
        setIsCreateDialogOpen(false);
        refetch();
    };

    const handleEditCompany = (companyId: string) => {
        console.log('Edit company:', companyId);
        // TODO: Implement edit functionality
        setIsDetailDialogOpen(false);
        setSelectedCompanyId(null);
    };

    const handleDeleteCompany = (companyId: string) => {
        if (window.confirm('Are you sure you want to delete this company?')) {
            // TODO: Implement delete company API call
            console.log('Delete company:', companyId);
            refetch();
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 [data-theme='dark']_&:text-white">Companies</h1>
                        <p className="text-gray-600 [data-theme='dark']_&:text-gray-400 mt-1">Manage your fleet companies</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse [data-theme='dark']_&:bg-gray-800">
                            <div className="h-6 bg-gray-200 rounded mb-4 [data-theme='dark']_&:bg-gray-700"></div>
                            <div className="h-4 bg-gray-200 rounded mb-2 [data-theme='dark']_&:bg-gray-700"></div>
                            <div className="h-4 bg-gray-200 rounded mb-4 w-3/4 [data-theme='dark']_&:bg-gray-700"></div>
                            <div className="flex justify-between">
                                <div className="h-4 bg-gray-200 rounded w-1/4 [data-theme='dark']_&:bg-gray-700"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/4 [data-theme='dark']_&:bg-gray-700"></div>
                            </div>
                        </div>
                    ))}
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
                        <span>Add New Company</span>
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
                                Error loading companies
                            </h3>
                            <div className="mt-2 text-sm text-red-700 [data-theme='dark']_&:text-red-300">
                                <p>Failed to fetch companies data. Please check your connection and try again.</p>
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
                    <span>Add New Company</span>
                </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Total Companies</h3>
                    <p className="text-2xl font-bold text-gray-900 [data-theme='dark']_&:text-white">{companies.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Total Vessels</h3>
                    <p className="text-2xl font-bold text-blue-600">{companies.reduce((sum, c) => sum + c.vessels, 0)}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Total Crews</h3>
                    <p className="text-2xl font-bold text-green-600">{companies.reduce((sum, c) => sum + c.crews, 0)}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Active Companies</h3>
                    <p className="text-2xl font-bold text-purple-600">{companies.length}</p>
                </div>
            </div>

            {/* Companies Grid */}
            {companies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map((company) => (
                        <div
                            key={company.id}
                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-150 cursor-pointer [data-theme='dark']_&:bg-gray-800"
                            onClick={() => handleViewCompanyDetail(company.id)}
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 [data-theme='dark']_&:text-white">{company.name}</h3>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 [data-theme='dark']_&:bg-green-900 [data-theme='dark']_&:text-green-200">
                    Active
                  </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <p className="text-sm text-gray-600 [data-theme='dark']_&:text-gray-400 flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {company.location}
                                    </p>
                                    <p className="text-sm text-gray-600 [data-theme='dark']_&:text-gray-400 flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Created: {company.created}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-gray-200 [data-theme='dark']_&:border-gray-700">
                                    <div className="text-center">
                                        <p className="text-lg font-semibold text-gray-900 [data-theme='dark']_&:text-white">{company.vessels}</p>
                                        <p className="text-xs text-gray-500 [data-theme='dark']_&:text-gray-400">Vessels</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-semibold text-gray-900 [data-theme='dark']_&:text-white">{company.crews}</p>
                                        <p className="text-xs text-gray-500 [data-theme='dark']_&:text-gray-400">Crews</p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewCompanyDetail(company.id);
                                        }}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium [data-theme='dark']_&:text-blue-400"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 [data-theme='dark']_&:text-white">No companies</h3>
                    <p className="mt-1 text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">Get started by creating a new company.</p>
                    <div className="mt-6">
                        <button
                            onClick={handleCreateCompany}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <svg className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add New Company
                        </button>
                    </div>
                </div>
            )}

            {/* Dialogs */}
            {isCreateDialogOpen && (
                <CreateCompanyDialog
                    isOpen={isCreateDialogOpen}
                    onClose={handleCloseCreateDialog}
                    onSubmit={handleSubmitCompany}
                />
            )}

            {isDetailDialogOpen && selectedCompanyId && (
                <CompanyDetailDialog
                    isOpen={isDetailDialogOpen}
                    onClose={handleCloseDetailDialog}
                    companyId={selectedCompanyId}
                    onEdit={handleEditCompany}
                    onDelete={handleDeleteCompany}
                />
            )}
        </div>
    );
}