// app/dashboard/components/pages/Procurements.tsx

'use client';

import { useState, useEffect } from 'react';
import { useAllVessels } from '@/app/hooks/useApiQuery';
import authService from "@/app/services/authService";

const BASE_URL = 'https://dev-api.nautiproconnect.com/api/v1/web';

interface ProcurementTimeline {
    id: number;
    procurement_id: string;
    action_by: string;
    action_at: string;
    role: string;
    status: string;
    remark: string;
    file_attachment: string;
    vessel_id: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

interface Department {
    id: number;
    name: string;
    is_custom: boolean;
    vessel_id: string;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
}

interface Procurement {
    id: number;
    procurement_id: string;
    vessel_id: string;
    request_at: string;
    department_id: string;
    requestor: string;
    item_name: string;
    qty: number;
    qty_unit: string;
    part_no: string;
    maker: string;
    description_spec: string;
    condition: string;
    reason: string;
    photo_attachment: string;
    file_attachment: string;
    estimate_delivery: string;
    required_onboard: string;
    delivery_port: string;
    priority: string;
    procurement_responsible: string;
    note: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    procurement_timeline: ProcurementTimeline[];
    vessel: any;
    requestor_user: any;
    department: Department;
    current_status?: string;
}

interface ApiResponse {
    code: number;
    status: string;
    data: {
        data: Procurement[];
        pagination: {
            current_page: number;
            limit: number;
            total_items: number;
            total_pages: number;
        };
    };
}

export default function Procurements() {
    const [procurements, setProcurements] = useState<Procurement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedVesselId, setSelectedVesselId] = useState<string>('');
    const [filters, setFilters] = useState({
        search: '',
        priority: '',
        condition: '',
        status: '',
        department: '',
    });

    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [selectedProcurementId, setSelectedProcurementId] = useState<number | null>(null);

    // Fetch vessels using the hook from Vessels page
    const { data: vesselsData, isLoading: vesselsLoading } = useAllVessels();

    // Set default vessel when vessels are loaded
    useEffect(() => {
        if (vesselsData && vesselsData.length > 0 && !selectedVesselId) {
            setSelectedVesselId(vesselsData[0].id);
        }
    }, [vesselsData]);

    // Fetch procurements from API
    const fetchProcurements = async (vesselId: string) => {
        if (!vesselId) return;

        setIsLoading(true);
        setError(null);
        try {
            const headers = authService.getAuthHeaders();
            const response = await fetch(
                `${BASE_URL}/procurements-by-vessel/${vesselId}?limit=100&offset=0`,
                {
                    method: "GET",
                    headers: headers
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch procurements');
            }

            const data: ApiResponse = await response.json();

            // Process procurements to add current status
            const processedProcurements = data.data.data.map(proc => {
                let currentStatus = 'Pending';

                if (proc.procurement_timeline && proc.procurement_timeline.length > 0) {
                    // Get the latest timeline entry
                    const latestTimeline = proc.procurement_timeline[proc.procurement_timeline.length - 1];
                    currentStatus = latestTimeline.status;
                }

                return {
                    ...proc,
                    current_status: currentStatus
                };
            });

            setProcurements(processedProcurements);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch procurements when vessel is selected
    useEffect(() => {
        if (selectedVesselId) {
            fetchProcurements(selectedVesselId);
        }
    }, [selectedVesselId]);

    // Filter procurements
    const filteredProcurements = procurements.filter(proc => {
        const matchesSearch = proc.item_name.toLowerCase().includes(filters.search.toLowerCase()) ||
            proc.procurement_id.toLowerCase().includes(filters.search.toLowerCase()) ||
            proc.part_no.toLowerCase().includes(filters.search.toLowerCase());
        const matchesPriority = !filters.priority || proc.priority === filters.priority;
        const matchesCondition = !filters.condition || proc.condition === filters.condition;
        const matchesStatus = !filters.status || proc.current_status === filters.status;
        const matchesDepartment = !filters.department || proc.department.name === filters.department;

        return matchesSearch && matchesPriority && matchesCondition && matchesStatus && matchesDepartment;
    });

    // Get unique values for filters
    const priorities = ['All Priorities', ...Array.from(new Set(procurements.map(p => p.priority).filter(p => p)))];
    const conditions = ['All Conditions', ...Array.from(new Set(procurements.map(p => p.condition).filter(c => c)))];
    const statuses = ['All Status', 'Pending', 'Approved', 'Rejected'];
    const departments = ['All Departments', ...Array.from(new Set(procurements.map(p => p.department.name).filter(d => d)))];

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
            priority: '',
            condition: '',
            status: '',
            department: '',
        });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High':
                return 'bg-red-100 text-red-800 [data-theme=\'dark\']_&:bg-red-900 [data-theme=\'dark\']_&:text-red-200';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-800 [data-theme=\'dark\']_&:bg-yellow-900 [data-theme=\'dark\']_&:text-yellow-200';
            case 'Low':
                return 'bg-green-100 text-green-800 [data-theme=\'dark\']_&:bg-green-900 [data-theme=\'dark\']_&:text-green-200';
            default:
                return 'bg-gray-100 text-gray-800 [data-theme=\'dark\']_&:bg-gray-700 [data-theme=\'dark\']_&:text-gray-200';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 text-green-800 [data-theme=\'dark\']_&:bg-green-900 [data-theme=\'dark\']_&:text-green-200';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800 [data-theme=\'dark\']_&:bg-yellow-900 [data-theme=\'dark\']_&:text-yellow-200';
            case 'Rejected':
                return 'bg-red-100 text-red-800 [data-theme=\'dark\']_&:bg-red-900 [data-theme=\'dark\']_&:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 [data-theme=\'dark\']_&:bg-gray-700 [data-theme=\'dark\']_&:text-gray-200';
        }
    };

    const getConditionColor = (condition: string) => {
        switch (condition) {
            case 'Emergency Breakdown':
                return 'bg-red-100 text-red-800 [data-theme=\'dark\']_&:bg-red-900 [data-theme=\'dark\']_&:text-red-200';
            case 'Routine':
                return 'bg-blue-100 text-blue-800 [data-theme=\'dark\']_&:bg-blue-900 [data-theme=\'dark\']_&:text-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 [data-theme=\'dark\']_&:bg-gray-700 [data-theme=\'dark\']_&:text-gray-200';
        }
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(parseInt(timestamp));
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            priority: '',
            condition: '',
            status: '',
            department: '',
        });
    };

    const handleViewDetail = (procurementId: number) => {
        setSelectedProcurementId(procurementId);
        setShowDetailDialog(true);
    };

    const handleCloseDetailDialog = () => {
        setShowDetailDialog(false);
        setSelectedProcurementId(null);
    };

    // Get selected vessel name
    const selectedVesselName = vesselsData?.find(v => v.id === selectedVesselId)?.name || 'Select Vessel';

    // Loading state
    if (vesselsLoading || (isLoading && !procurements.length)) {
        return (
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 [data-theme='dark']_&:text-white">Procurement Management</h1>
                        <p className="text-gray-600 [data-theme='dark']_&:text-gray-400 mt-1">Manage vessel procurement requests</p>
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
                        <h1 className="text-2xl font-bold text-gray-800 [data-theme='dark']_&:text-white">Procurement Management</h1>
                        <p className="text-gray-600 [data-theme='dark']_&:text-gray-400 mt-1">Manage vessel procurement requests</p>
                    </div>
                    <button
                        onClick={() => fetchProcurements(selectedVesselId)}
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
                                Error loading procurements
                            </h3>
                            <div className="mt-2 text-sm text-red-700 [data-theme='dark']_&:text-red-300">
                                <p>Failed to fetch procurement data. Please check your connection and try again.</p>
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={() => fetchProcurements(selectedVesselId)}
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
                    <h1 className="text-2xl font-bold text-gray-800 [data-theme='dark']_&:text-white">Procurement Management</h1>
                    <p className="text-gray-600 [data-theme='dark']_&:text-gray-400 mt-1">Manage vessel procurement requests</p>
                </div>
                {/*<button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-150 flex items-center space-x-2">*/}
                {/*    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
                {/*        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />*/}
                {/*    </svg>*/}
                {/*    <span>Add New Request</span>*/}
                {/*</button>*/}
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
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Total Requests</h3>
                    <p className="text-2xl font-bold text-gray-900 [data-theme='dark']_&:text-white">{procurements.length}</p>
                    <p className="text-xs text-gray-500 [data-theme='dark']_&:text-gray-400 mt-1">{selectedVesselName}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Pending</h3>
                    <p className="text-2xl font-bold text-yellow-600">{procurements.filter(p => p.current_status === 'Pending').length}</p>
                    <p className="text-xs text-gray-500 [data-theme='dark']_&:text-gray-400 mt-1">Awaiting approval</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Approved</h3>
                    <p className="text-2xl font-bold text-green-600">{procurements.filter(p => p.current_status === 'Approved').length}</p>
                    <p className="text-xs text-gray-500 [data-theme='dark']_&:text-gray-400 mt-1">Ready to process</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow [data-theme='dark']_&:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 [data-theme='dark']_&:text-gray-400">Rejected</h3>
                    <p className="text-2xl font-bold text-red-600">{procurements.filter(p => p.current_status === 'Rejected').length}</p>
                    <p className="text-xs text-gray-500 [data-theme='dark']_&:text-gray-400 mt-1">Needs revision</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6 [data-theme='dark']_&:bg-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    {/* Search */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 [data-theme='dark']_&:text-gray-300 mb-1">
                            Search
                        </label>
                        <input
                            type="text"
                            placeholder="Search item, ID, or part no..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:border-gray-600 [data-theme='dark']_&:text-white"
                        />
                    </div>

                    {/* Priority Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 [data-theme='dark']_&:text-gray-300 mb-1">
                            Priority
                        </label>
                        <select
                            value={filters.priority}
                            onChange={(e) => handleFilterChange('priority', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:border-gray-600 [data-theme='dark']_&:text-white"
                        >
                            <option value="">All Priorities</option>
                            {priorities.slice(1).map((priority) => (
                                <option key={priority} value={priority}>{priority}</option>
                            ))}
                        </select>
                    </div>

                    {/* Condition Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 [data-theme='dark']_&:text-gray-300 mb-1">
                            Condition
                        </label>
                        <select
                            value={filters.condition}
                            onChange={(e) => handleFilterChange('condition', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:border-gray-600 [data-theme='dark']_&:text-white"
                        >
                            <option value="">All Conditions</option>
                            {conditions.slice(1).map((condition) => (
                                <option key={condition} value={condition}>{condition}</option>
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

            {/* Procurements Table */}
            {filteredProcurements.length > 0 ? (
                <div className="bg-white rounded-lg shadow overflow-hidden [data-theme='dark']_&:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 [data-theme='dark']_&:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Request ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Item Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Required Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Priority</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Condition</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 [data-theme='dark']_&:bg-gray-800 [data-theme='dark']_&:divide-gray-600">
                            {filteredProcurements.map((proc) => (
                                <tr key={proc.id} className="hover:bg-gray-50 [data-theme='dark']_&:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center [data-theme='dark']_&:bg-indigo-900">
                                                    <svg className="h-6 w-6 text-indigo-600 [data-theme='dark']_&:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 [data-theme='dark']_&:text-white">{proc.procurement_id}</div>
                                                <div className="text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">
                                                    {formatDate(proc.request_at)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900 [data-theme='dark']_&:text-white">{proc.item_name}</div>
                                        <div className="text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">
                                            {proc.part_no && `Part No: ${proc.part_no}`}
                                            {proc.maker && ` | Maker: ${proc.maker}`}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 [data-theme='dark']_&:text-white">
                                            {proc.department.name || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 [data-theme='dark']_&:text-white">
                                            {proc.qty} {proc.qty_unit}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">
                                        {formatDate(proc.required_onboard)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(proc.priority)}`}>
                                                {proc.priority}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(proc.condition)}`}>
                                                {proc.condition}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(proc.current_status || 'Pending')}`}>
                                                {proc.current_status}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleViewDetail(proc.id)}
                                            className="text-blue-600 hover:text-blue-900 [data-theme='dark']_&:text-blue-400 [data-theme='dark']_&:hover:text-blue-300 mr-4"
                                        >
                                            View Details
                                        </button>
                                        {proc.file_attachment && (
                                            <a
                                                href={proc.file_attachment}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-green-600 hover:text-green-900 [data-theme='dark']_&:text-green-400 [data-theme='dark']_&:hover:text-green-300"
                                            >
                                                Download
                                            </a>
                                        )}
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 [data-theme='dark']_&:text-white">No procurement requests found</h3>
                    <p className="mt-1 text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">
                        {Object.values(filters).some(f => f)
                            ? 'No procurement requests match your current filters.'
                            : `Get started by adding procurement requests for ${selectedVesselName}.`
                        }
                    </p>
                    <div className="mt-6">
                        <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                            <svg className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add New Request
                        </button>
                    </div>
                </div>
            )}

            {/* Procurement Detail Dialog - Optional, create if needed */}
            {/*{showDetailDialog && selectedProcurementId && (
                <ProcurementDetailDialog
                    isOpen={showDetailDialog}
                    procurementId={selectedProcurementId}
                    onClose={handleCloseDetailDialog}
                />
            )}*/}
        </div>
    );
}