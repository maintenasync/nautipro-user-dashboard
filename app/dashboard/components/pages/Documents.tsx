// app/dashboard/components/pages/Documents.tsx

'use client';

import { useState, useEffect } from 'react';
import { useAllVessels } from '@/app/hooks/useApiQuery';
import authService from "@/app/services/authService";

const BASE_URL = 'https://dev-api.nautiproconnect.com/api/v1/web';

interface Document {
    id: number;
    certificate_title: string;
    issuing_authority: string;
    issue_date: string;
    expiry_date: string;
    renewal_frequency: string;
    file_path: string;
    expiry_reminder_enabled: boolean;
    reminder_prior: number;
    remark: string;
    logs: string;
    is_deleted: boolean;
    vessel_id: string;
    created_at: string;
    updated_at: string;
    next_triggered_at: string;
    status?: string;
    days_remaining?: number;
}

interface ApiResponse {
    code: number;
    status: string;
    data: {
        data: Document[];
        pagination: {
            current_page: number;
            limit: number;
            total_items: number;
            total_pages: number;
        };
    };
}

export default function Documents() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedVesselId, setSelectedVesselId] = useState<string>('');
    const [filters, setFilters] = useState({
        search: '',
        renewalFrequency: '',
        authority: '',
    });

    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);

    // Fetch vessels using the hook from Vessels page
    const { data: vesselsData, isLoading: vesselsLoading } = useAllVessels();

    // Set default vessel when vessels are loaded
    useEffect(() => {
        if (vesselsData && vesselsData.length > 0 && !selectedVesselId) {
            setSelectedVesselId(vesselsData[0].id);
        }
    }, [vesselsData]);

    // Fetch documents from API
    const fetchDocuments = async (vesselId: string) => {
        if (!vesselId) return;

        setIsLoading(true);
        setError(null);
        try {
            const headers = authService.getAuthHeaders();
            const response = await fetch(
                `${BASE_URL}/documents-by-vessel/${vesselId}?limit=100&offset=0`,
                {
                    method: "GET",
                    headers: headers
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch documents');
            }

            const data: ApiResponse = await response.json();

            // Process documents to add status and days remaining
            const processedDocuments = data.data.data.map(doc => {
                const expiryDate = new Date(parseInt(doc.expiry_date));
                const today = new Date();
                const daysRemaining = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                let status = 'Valid';
                if (daysRemaining < 0) {
                    status = 'Expired';
                } else if (daysRemaining <= 30) {
                    status = 'Expiring Soon';
                }

                return {
                    ...doc,
                    status,
                    days_remaining: daysRemaining
                };
            });

            setDocuments(processedDocuments);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch documents when vessel is selected
    useEffect(() => {
        if (selectedVesselId) {
            fetchDocuments(selectedVesselId);
        }
    }, [selectedVesselId]);

    // Filter documents
    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.certificate_title.toLowerCase().includes(filters.search.toLowerCase()) ||
            doc.issuing_authority.toLowerCase().includes(filters.search.toLowerCase());
        const matchesRenewal = !filters.renewalFrequency || doc.renewal_frequency === filters.renewalFrequency;
        const matchesAuthority = !filters.authority || doc.issuing_authority === filters.authority;

        return matchesSearch && matchesRenewal && matchesAuthority;
    });

    // Get unique renewal frequencies
    const renewalFrequencies = ['All Frequencies', ...Array.from(new Set(documents.map(d => d.renewal_frequency)))];

    // Get unique authorities
    const authorities = ['All Authorities', ...Array.from(new Set(documents.map(d => d.issuing_authority)))];

    const handleFilterChange = (filterType: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const handleVesselChange = (vesselId: string) => {
        setSelectedVesselId(vesselId);
        // Reset filters when changing vessel
        setFilters({
            search: '',
            renewalFrequency: '',
            authority: '',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Valid':
                return 'bg-green-100 text-green-800 [data-theme=\'dark\']_&:bg-green-900 [data-theme=\'dark\']_&:text-green-200';
            case 'Expiring Soon':
                return 'bg-yellow-100 text-yellow-800 [data-theme=\'dark\']_&:bg-yellow-900 [data-theme=\'dark\']_&:text-yellow-200';
            case 'Expired':
                return 'bg-red-100 text-red-800 [data-theme=\'dark\']_&:bg-red-900 [data-theme=\'dark\']_&:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 [data-theme=\'dark\']_&:bg-gray-700 [data-theme=\'dark\']_&:text-gray-200';
        }
    };

    const getDaysRemainingColor = (days: number) => {
        if (days < 0) return 'text-red-600 [data-theme=\'dark\']_&:text-red-400';
        if (days <= 30) return 'text-yellow-600 [data-theme=\'dark\']_&:text-yellow-400';
        return 'text-green-600 [data-theme=\'dark\']_&:text-green-400';
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(parseInt(timestamp));
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            renewalFrequency: '',
            authority: '',
        });
    };

    const handleViewDetail = (documentId: number) => {
        setSelectedDocumentId(documentId);
        setShowDetailDialog(true);
    };

    const handleCloseDetailDialog = () => {
        setShowDetailDialog(false);
        setSelectedDocumentId(null);
    };

    // Get selected vessel name
    const selectedVesselName = vesselsData?.find(v => v.id === selectedVesselId)?.name || 'Select Vessel';

    // Loading state
    if (vesselsLoading || (isLoading && !documents.length)) {
        return (
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 [data-theme='dark']_&:text-white">Document Management</h1>
                        <p className="text-gray-600 [data-theme='dark']_&:text-gray-400 mt-1">Manage vessel certificates and documents</p>
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
                        <h1 className="text-2xl font-bold text-gray-800 [data-theme='dark']_&:text-white">Document Management</h1>
                        <p className="text-gray-600 [data-theme='dark']_&:text-gray-400 mt-1">Manage vessel certificates and documents</p>
                    </div>
                    <button
                        onClick={() => fetchDocuments(selectedVesselId)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-150 flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Retry</span>
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
                                Error loading documents
                            </h3>
                            <div className="mt-2 text-sm text-red-700 [data-theme='dark']_&:text-red-300">
                                <p>Failed to fetch document data. Please check your connection and try again.</p>
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={() => fetchDocuments(selectedVesselId)}
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
                    <h1 className="text-2xl font-bold text-gray-800 [data-theme='dark']_&:text-white">Document Management</h1>
                    <p className="text-gray-600 [data-theme='dark']_&:text-gray-400 mt-1">Manage vessel certificates and documents</p>
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-150 flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add New Document</span>
                </button>
            </div>

            {/* Vessel Selection */}
            <div className="bg-white rounded-lg shadow p-4 mb-6 [data-theme='dark']_&:bg-gray-800">
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 [data-theme='dark']_&:text-gray-300 mb-2">
                            Select Vessel
                        </label>
                        <select
                            value={selectedVesselId}
                            onChange={(e) => handleVesselChange(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:border-gray-600 [data-theme='dark']_&:text-white"
                        >
                            {vesselsData?.map((vessel) => (
                                <option key={vessel.id} value={vessel.id}>
                                    {vessel.name} - {vessel.imo} ({vessel.company})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Total Documents</h3>
                    <p className="text-2xl font-bold text-gray-900 [data-theme='dark']_&:text-white">{documents.length}</p>
                    <p className="text-xs text-gray-500 [data-theme='dark']_&:text-gray-400 mt-1">{selectedVesselName}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Valid</h3>
                    <p className="text-2xl font-bold text-green-600">{documents.filter(d => d.status === 'Valid').length}</p>
                    <p className="text-xs text-gray-500 [data-theme='dark']_&:text-gray-400 mt-1">Active certificates</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Expiring Soon</h3>
                    <p className="text-2xl font-bold text-yellow-600">{documents.filter(d => d.status === 'Expiring Soon').length}</p>
                    <p className="text-xs text-gray-500 [data-theme='dark']_&:text-gray-400 mt-1">Within 30 days</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Expired</h3>
                    <p className="text-2xl font-bold text-red-600">{documents.filter(d => d.status === 'Expired').length}</p>
                    <p className="text-xs text-gray-500 [data-theme='dark']_&:text-gray-400 mt-1">Needs renewal</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6 [data-theme='dark']_&:bg-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 [data-theme='dark']_&:text-gray-300 mb-1">
                            Search
                        </label>
                        <input
                            type="text"
                            placeholder="Search certificate or authority..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:border-gray-600 [data-theme='dark']_&:text-white"
                        />
                    </div>

                    {/* Renewal Frequency Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 [data-theme='dark']_&:text-gray-300 mb-1">
                            Renewal Frequency
                        </label>
                        <select
                            value={filters.renewalFrequency}
                            onChange={(e) => handleFilterChange('renewalFrequency', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:border-gray-600 [data-theme='dark']_&:text-white"
                        >
                            <option value="">All Frequencies</option>
                            {renewalFrequencies.slice(1).map((freq) => (
                                <option key={freq} value={freq}>{freq}</option>
                            ))}
                        </select>
                    </div>

                    {/* Issuing Authority Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 [data-theme='dark']_&:text-gray-300 mb-1">
                            Issuing Authority
                        </label>
                        <select
                            value={filters.authority}
                            onChange={(e) => handleFilterChange('authority', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:border-gray-600 [data-theme='dark']_&:text-white"
                        >
                            <option value="">All Authorities</option>
                            {authorities.slice(1).map((auth) => (
                                <option key={auth} value={auth}>{auth}</option>
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

            {/* Documents Table */}
            {filteredDocuments.length > 0 ? (
                <div className="bg-white rounded-lg shadow overflow-hidden [data-theme='dark']_&:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 [data-theme='dark']_&:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Certificate</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Issuing Authority</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Issue Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Expiry Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Renewal Frequency</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 [data-theme='dark']_&:bg-gray-800 [data-theme='dark']_&:divide-gray-600">
                            {filteredDocuments.map((doc) => (
                                <tr key={doc.id} className="hover:bg-gray-50 [data-theme='dark']_&:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center [data-theme='dark']_&:bg-blue-900">
                                                    <svg className="h-6 w-6 text-blue-600 [data-theme='dark']_&:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 [data-theme='dark']_&:text-white">{doc.certificate_title}</div>
                                                <div className="text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">
                                                        <span className={getDaysRemainingColor(doc.days_remaining || 0)}>
                                                            {doc.days_remaining && doc.days_remaining < 0
                                                                ? `Expired ${Math.abs(doc.days_remaining)} days ago`
                                                                : `${doc.days_remaining} days remaining`
                                                            }
                                                        </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 [data-theme='dark']_&:text-white">{doc.issuing_authority}</div>
                                        <div className="text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">
                                            {doc.expiry_reminder_enabled ? `Reminder ${doc.reminder_prior} days prior` : 'No reminder'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">
                                        {formatDate(doc.issue_date)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">
                                        {formatDate(doc.expiry_date)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 [data-theme='dark']_&:bg-purple-900 [data-theme='dark']_&:text-purple-200">
                                                {doc.renewal_frequency}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status || 'Valid')}`}>
                                                {doc.status}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleViewDetail(doc.id)}
                                            className="text-blue-600 hover:text-blue-900 [data-theme='dark']_&:text-blue-400 [data-theme='dark']_&:hover:text-blue-300 mr-4"
                                        >
                                            View Details
                                        </button>
                                        <a
                                            href={doc.file_path}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-green-600 hover:text-green-900 [data-theme='dark']_&:text-green-400 [data-theme='dark']_&:hover:text-green-300"
                                        >
                                            Download
                                        </a>
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 [data-theme='dark']_&:text-white">No documents found</h3>
                    <p className="mt-1 text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">
                        {Object.values(filters).some(f => f)
                            ? 'No documents match your current filters.'
                            : `Get started by adding documents for ${selectedVesselName}.`
                        }
                    </p>
                    <div className="mt-6">
                        <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                            <svg className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add New Document
                        </button>
                    </div>
                </div>
            )}

            {/* Document Detail Dialog - Optional, create if needed */}
            {/*{showDetailDialog && selectedDocumentId && (
                <DocumentDetailDialog
                    isOpen={showDetailDialog}
                    documentId={selectedDocumentId}
                    onClose={handleCloseDetailDialog}
                />
            )}*/}
        </div>
    );
}