// app/dashboard/components/dialogs/CompanyDetailDialog.tsx

'use client';

import { useState, useEffect } from 'react';

interface CompanyDetailDialogProps {
    isOpen: boolean;
    companyId: number | null;
    onClose: () => void;
    onEdit?: (companyId: number) => void;
}

interface CompanyDetails {
    id: number;
    name: string;
    registrationNumber: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
    website: string;
    logo: string;
    // Additional details
    established: string;
    ceo: string;
    employees: number;
    fleetSize: number;
    totalTonnage: number;
    operationalStatus: string;
    // Vessels
    vessels: {
        id: number;
        name: string;
        type: string;
        status: string;
        imo: string;
    }[];
    // Licenses
    licenses: {
        id: number;
        name: string;
        issueDate: string;
        expiryDate: string;
        status: string;
    }[];
    // Financial
    financialInfo: {
        revenue: number;
        assets: number;
        yearlyGrowth: number;
        rating: string;
    };
}

export default function CompanyDetailDialog({ isOpen, companyId, onClose, onEdit }: CompanyDetailDialogProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'vessels' | 'licenses' | 'financial'>('overview');
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Mock data - in real app, this would come from API based on companyId
    const companyDetails: CompanyDetails = {
        id: companyId || 1,
        name: 'Ocean Shipping Ltd',
        registrationNumber: 'SG-2018-OSL-001',
        address: '123 Marina Bay Drive',
        city: 'Singapore',
        province: 'Central Singapore',
        postalCode: '018956',
        country: 'Singapore',
        phone: '+65 6123 4567',
        email: 'info@oceanshipping.com',
        website: 'https://www.oceanshipping.com',
        logo: '/api/placeholder/150/150',
        established: '2018-03-15',
        ceo: 'John Maritime',
        employees: 150,
        fleetSize: 12,
        totalTonnage: 450000,
        operationalStatus: 'Active',
        vessels: [
            { id: 1, name: 'Ocean Explorer', type: 'Cargo Ship', status: 'Active', imo: 'IMO1234567' },
            { id: 2, name: 'Deep Blue', type: 'Bulk Carrier', status: 'Active', imo: 'IMO4567890' },
            { id: 3, name: 'Sea Master', type: 'Tanker', status: 'Maintenance', imo: 'IMO7890123' },
        ],
        licenses: [
            { id: 1, name: 'Maritime Operation License', issueDate: '2024-01-15', expiryDate: '2025-01-15', status: 'Active' },
            { id: 2, name: 'International Shipping Permit', issueDate: '2024-03-10', expiryDate: '2025-03-10', status: 'Active' },
            { id: 3, name: 'Environmental Compliance Certificate', issueDate: '2024-06-01', expiryDate: '2024-12-01', status: 'Expiring Soon' },
        ],
        financialInfo: {
            revenue: 125000000,
            assets: 280000000,
            yearlyGrowth: 12.5,
            rating: 'A+'
        }
    };

    // Handle dialog visibility with animation
    useEffect(() => {
        if (isOpen && companyId) {
            document.body.style.overflow = 'hidden';
            setIsVisible(true);
            setTimeout(() => setIsAnimating(true), 10);
        } else {
            document.body.style.overflow = 'unset';
            setIsAnimating(false);
            setTimeout(() => setIsVisible(false), 200);
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, companyId]);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '🏢' },
        { id: 'vessels', label: 'Fleet', icon: '🚢' },
        { id: 'licenses', label: 'Licenses', icon: '📋' },
        { id: 'financial', label: 'Financial', icon: '💰' }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
            case 'Valid':
                return 'bg-green-100 text-green-800 [data-theme=\'dark\']_&:bg-green-900 [data-theme=\'dark\']_&:text-green-200';
            case 'Maintenance':
            case 'Expiring Soon':
                return 'bg-yellow-100 text-yellow-800 [data-theme=\'dark\']_&:bg-yellow-900 [data-theme=\'dark\']_&:text-yellow-200';
            case 'Inactive':
            case 'Expired':
                return 'bg-red-100 text-red-800 [data-theme=\'dark\']_&:bg-red-900 [data-theme=\'dark\']_&:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 [data-theme=\'dark\']_&:bg-gray-700 [data-theme=\'dark\']_&:text-gray-200';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(amount);
    };

    const handleClose = () => {
        setActiveTab('overview');
        onClose();
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleEdit = () => {
        if (onEdit && companyId) {
            onEdit(companyId);
        }
    };

    if (!isVisible || !companyId) return null;

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-200 ease-out ${
                isAnimating
                    ? 'bg-opacity-50 backdrop-blur-sm'
                    : 'bg-opacity-0 backdrop-blur-0'
            }`}
            onClick={handleBackdropClick}
        >
            <div
                className={`bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl transition-all duration-200 ease-out [data-theme='dark']_&:bg-gray-800 ${
                    isAnimating
                        ? 'scale-100 opacity-100 translate-y-0'
                        : 'scale-95 opacity-0 translate-y-4'
                }`}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 [data-theme='dark']_&:border-gray-600">
                    <div className="flex items-center space-x-4">
                        {/* Company Logo */}
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">
                                {companyDetails.name.split(' ').map(word => word[0]).join('').substring(0, 2)}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 [data-theme='dark']_&:text-white">{companyDetails.name}</h2>
                            <div className="flex items-center space-x-3 mt-1">
                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(companyDetails.operationalStatus)}`}>
                                    {companyDetails.operationalStatus}
                                </span>
                                <span className="text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">
                                    {companyDetails.registrationNumber}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleEdit}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-150 text-sm"
                        >
                            Edit Company
                        </button>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 p-2 rounded-md hover:bg-gray-100 transition-colors duration-150 [data-theme='dark']_&:hover:bg-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 [data-theme='dark']_&:border-gray-600">
                    <nav className="flex space-x-8 px-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150 ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600 [data-theme=\'dark\']_&:text-blue-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 [data-theme=\'dark\']_&:text-gray-400 [data-theme=\'dark\']_&:hover:text-gray-200'
                                }`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg [data-theme='dark']_&:bg-blue-900">
                                    <h4 className="text-sm font-medium text-blue-600 [data-theme='dark']_&:text-blue-300">Fleet Size</h4>
                                    <p className="text-2xl font-bold text-blue-900 [data-theme='dark']_&:text-blue-100">{companyDetails.fleetSize}</p>
                                    <p className="text-sm text-blue-600 [data-theme='dark']_&:text-blue-300">Active Vessels</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg [data-theme='dark']_&:bg-green-900">
                                    <h4 className="text-sm font-medium text-green-600 [data-theme='dark']_&:text-green-300">Total Tonnage</h4>
                                    <p className="text-2xl font-bold text-green-900 [data-theme='dark']_&:text-green-100">{companyDetails.totalTonnage.toLocaleString()}</p>
                                    <p className="text-sm text-green-600 [data-theme='dark']_&:text-green-300">MT Combined</p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg [data-theme='dark']_&:bg-purple-900">
                                    <h4 className="text-sm font-medium text-purple-600 [data-theme='dark']_&:text-purple-300">Employees</h4>
                                    <p className="text-2xl font-bold text-purple-900 [data-theme='dark']_&:text-purple-100">{companyDetails.employees}</p>
                                    <p className="text-sm text-purple-600 [data-theme='dark']_&:text-purple-300">Total Staff</p>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-lg [data-theme='dark']_&:bg-orange-900">
                                    <h4 className="text-sm font-medium text-orange-600 [data-theme='dark']_&:text-orange-300">Est. Years</h4>
                                    <p className="text-2xl font-bold text-orange-900 [data-theme='dark']_&:text-orange-100">
                                        {new Date().getFullYear() - new Date(companyDetails.established).getFullYear()}
                                    </p>
                                    <p className="text-sm text-orange-600 [data-theme='dark']_&:text-orange-300">Years Operating</p>
                                </div>
                            </div>

                            {/* Company Information */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Basic Information */}
                                <div className="bg-gray-50 p-6 rounded-lg [data-theme='dark']_&:bg-gray-700">
                                    <h4 className="font-semibold text-gray-800 [data-theme='dark']_&:text-gray-200 mb-4">Company Information</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 [data-theme='dark']_&:text-gray-400">Registration:</span>
                                            <span className="font-medium [data-theme='dark']_&:text-gray-200">{companyDetails.registrationNumber}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 [data-theme='dark']_&:text-gray-400">Established:</span>
                                            <span className="font-medium [data-theme='dark']_&:text-gray-200">{new Date(companyDetails.established).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 [data-theme='dark']_&:text-gray-400">CEO:</span>
                                            <span className="font-medium [data-theme='dark']_&:text-gray-200">{companyDetails.ceo}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 [data-theme='dark']_&:text-gray-400">Website:</span>
                                            <a href={companyDetails.website} className="font-medium text-blue-600 hover:text-blue-800 [data-theme='dark']_&:text-blue-400" target="_blank" rel="noopener noreferrer">
                                                Visit Website
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="bg-gray-50 p-6 rounded-lg [data-theme='dark']_&:bg-gray-700">
                                    <h4 className="font-semibold text-gray-800 [data-theme='dark']_&:text-gray-200 mb-4">Contact Information</h4>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <span className="text-gray-600 [data-theme='dark']_&:text-gray-400">Address:</span>
                                            <p className="font-medium [data-theme='dark']_&:text-gray-200 mt-1">
                                                {companyDetails.address}<br/>
                                                {companyDetails.city}, {companyDetails.province} {companyDetails.postalCode}<br/>
                                                {companyDetails.country}
                                            </p>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 [data-theme='dark']_&:text-gray-400">Phone:</span>
                                            <span className="font-medium [data-theme='dark']_&:text-gray-200">{companyDetails.phone}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 [data-theme='dark']_&:text-gray-400">Email:</span>
                                            <a href={`mailto:${companyDetails.email}`} className="font-medium text-blue-600 hover:text-blue-800 [data-theme='dark']_&:text-blue-400">
                                                {companyDetails.email}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Vessels Tab */}
                    {activeTab === 'vessels' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 [data-theme='dark']_&:text-gray-200">Fleet Overview</h3>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-150 text-sm">
                                    Add Vessel
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {companyDetails.vessels.map((vessel) => (
                                    <div key={vessel.id} className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow [data-theme='dark']_&:bg-gray-700">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-semibold text-gray-800 [data-theme='dark']_&:text-gray-200">{vessel.name}</h4>
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(vessel.status)}`}>
                                                {vessel.status}
                                            </span>
                                        </div>
                                        <div className="space-y-2 text-sm text-gray-600 [data-theme='dark']_&:text-gray-400">
                                            <div>Type: {vessel.type}</div>
                                            <div>IMO: {vessel.imo}</div>
                                        </div>
                                        <div className="mt-3 flex space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900 text-sm [data-theme='dark']_&:text-blue-400">View Details</button>
                                            <button className="text-green-600 hover:text-green-900 text-sm [data-theme='dark']_&:text-green-400">Edit</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Licenses Tab */}
                    {activeTab === 'licenses' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 [data-theme='dark']_&:text-gray-200">Company Licenses</h3>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-150 text-sm">
                                    Add License
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {companyDetails.licenses.map((license) => (
                                    <div key={license.id} className="bg-gray-50 p-4 rounded-lg [data-theme='dark']_&:bg-gray-700">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-semibold text-gray-800 [data-theme='dark']_&:text-gray-200">{license.name}</h4>
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(license.status)}`}>
                                                {license.status}
                                            </span>
                                        </div>
                                        <div className="space-y-2 text-sm text-gray-600 [data-theme='dark']_&:text-gray-400">
                                            <div>Issue Date: {new Date(license.issueDate).toLocaleDateString()}</div>
                                            <div>Expiry Date: {new Date(license.expiryDate).toLocaleDateString()}</div>
                                        </div>
                                        <div className="mt-3 flex space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900 text-sm [data-theme='dark']_&:text-blue-400">View</button>
                                            <button className="text-green-600 hover:text-green-900 text-sm [data-theme='dark']_&:text-green-400">Renew</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Financial Tab */}
                    {activeTab === 'financial' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800 [data-theme='dark']_&:text-gray-200">Financial Overview</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-green-50 p-6 rounded-lg [data-theme='dark']_&:bg-green-900">
                                    <h4 className="text-sm font-medium text-green-600 [data-theme='dark']_&:text-green-300">Annual Revenue</h4>
                                    <p className="text-2xl font-bold text-green-900 [data-theme='dark']_&:text-green-100">
                                        {formatCurrency(companyDetails.financialInfo.revenue)}
                                    </p>
                                    <p className="text-sm text-green-600 [data-theme='dark']_&:text-green-300">2024 Performance</p>
                                </div>
                                <div className="bg-blue-50 p-6 rounded-lg [data-theme='dark']_&:bg-blue-900">
                                    <h4 className="text-sm font-medium text-blue-600 [data-theme='dark']_&:text-blue-300">Total Assets</h4>
                                    <p className="text-2xl font-bold text-blue-900 [data-theme='dark']_&:text-blue-100">
                                        {formatCurrency(companyDetails.financialInfo.assets)}
                                    </p>
                                    <p className="text-sm text-blue-600 [data-theme='dark']_&:text-blue-300">Market Value</p>
                                </div>
                                <div className="bg-purple-50 p-6 rounded-lg [data-theme='dark']_&:bg-purple-900">
                                    <h4 className="text-sm font-medium text-purple-600 [data-theme='dark']_&:text-purple-300">Growth Rate</h4>
                                    <p className="text-2xl font-bold text-purple-900 [data-theme='dark']_&:text-purple-100">
                                        +{companyDetails.financialInfo.yearlyGrowth}%
                                    </p>
                                    <p className="text-sm text-purple-600 [data-theme='dark']_&:text-purple-300">Year over Year</p>
                                </div>
                                <div className="bg-orange-50 p-6 rounded-lg [data-theme='dark']_&:bg-orange-900">
                                    <h4 className="text-sm font-medium text-orange-600 [data-theme='dark']_&:text-orange-300">Credit Rating</h4>
                                    <p className="text-2xl font-bold text-orange-900 [data-theme='dark']_&:text-orange-100">
                                        {companyDetails.financialInfo.rating}
                                    </p>
                                    <p className="text-sm text-orange-600 [data-theme='dark']_&:text-orange-300">Industry Standard</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg [data-theme='dark']_&:bg-gray-700">
                                <h4 className="font-semibold text-gray-800 [data-theme='dark']_&:text-gray-200 mb-4">Financial Health</h4>
                                <p className="text-sm text-gray-600 [data-theme='dark']_&:text-gray-400">
                                    The company demonstrates strong financial performance with consistent growth and excellent credit rating.
                                    Fleet expansion and operational efficiency contribute to sustained profitability.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}