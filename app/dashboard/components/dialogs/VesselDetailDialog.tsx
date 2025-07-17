// app/dashboard/components/dialogs/VesselDetailDialog.tsx

'use client';

import { useState, useEffect } from 'react';

interface VesselDetailDialogProps {
    isOpen: boolean;
    vesselId: number | null;
    onClose: () => void;
    onEdit?: (vesselId: number) => void;
}

interface VesselDetails {
    id: number;
    name: string;
    previousName: string;
    imo: string;
    mmsi: string;
    flag: string;
    callsign: string;
    grossTonnage: number;
    summerDeadweight: number;
    yearOfBuild: number;
    vesselType: string;
    vesselClass: string;
    company: string;
    status: string;
    image: string;
    // Additional details
    owner: string;
    operator: string;
    port: string;
    lastUpdate: string;
    nextInspection: string;
    registrationDate: string;
    length: number;
    width: number;
    draft: number;
    enginePower: number;
    fuelType: string;
    crew: number;
    // Documents
    documents: {
        id: number;
        name: string;
        type: string;
        expiryDate: string;
        status: string;
    }[];
    // Licenses
    licenses: {
        id: number;
        name: string;
        issueDate: string;
        expiryDate: string;
        status: string;
    }[];
    // Maintenance History
    maintenanceHistory: {
        id: number;
        date: string;
        type: string;
        description: string;
        cost: number;
        status: string;
    }[];
}

export default function VesselDetailDialog({ isOpen, vesselId, onClose, onEdit }: VesselDetailDialogProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'licenses' | 'maintenance'>('overview');
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Mock data - in real app, this would come from API based on vesselId
    const vesselDetails: VesselDetails = {
        id: vesselId || 1,
        name: 'Ocean Explorer',
        previousName: 'Sea Master',
        imo: 'IMO1234567',
        mmsi: '123456789',
        flag: 'Singapore',
        callsign: 'ABCD123',
        grossTonnage: 25000,
        summerDeadweight: 40000,
        yearOfBuild: 2018,
        vesselType: 'Cargo Ship',
        vesselClass: 'Lloyd\'s Register',
        company: 'Ocean Shipping Ltd',
        status: 'Active',
        image: '/api/placeholder/800/400',
        owner: 'Ocean Shipping Ltd',
        operator: 'Maritime Operations Corp',
        port: 'Singapore Port',
        lastUpdate: '2024-07-15',
        nextInspection: '2024-12-15',
        registrationDate: '2018-03-20',
        length: 180,
        width: 32,
        draft: 12,
        enginePower: 12000,
        fuelType: 'Heavy Fuel Oil',
        crew: 24,
        documents: [
            { id: 1, name: 'Safety Certificate', type: 'Certificate', expiryDate: '2025-03-15', status: 'Valid' },
            { id: 2, name: 'Insurance Policy', type: 'Insurance', expiryDate: '2024-12-31', status: 'Valid' },
            { id: 3, name: 'Radio License', type: 'License', expiryDate: '2024-09-30', status: 'Expiring Soon' },
        ],
        licenses: [
            { id: 1, name: 'Navigation License', issueDate: '2024-01-15', expiryDate: '2025-01-15', status: 'Active' },
            { id: 2, name: 'Port Entry Permit', issueDate: '2024-06-01', expiryDate: '2024-12-01', status: 'Active' },
            { id: 3, name: 'Environmental Permit', issueDate: '2024-03-10', expiryDate: '2024-12-10', status: 'Expiring Soon' },
        ],
        maintenanceHistory: [
            { id: 1, date: '2024-07-01', type: 'Engine Maintenance', description: 'Routine engine inspection and oil change', cost: 15000, status: 'Completed' },
            { id: 2, date: '2024-06-15', type: 'Hull Inspection', description: 'Underwater hull inspection and cleaning', cost: 8000, status: 'Completed' },
            { id: 3, date: '2024-05-20', type: 'Safety Equipment', description: 'Fire extinguisher replacement and testing', cost: 3000, status: 'Completed' },
        ]
    };

    // Handle dialog visibility with animation
    useEffect(() => {
        if (isOpen && vesselId) {
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
    }, [isOpen, vesselId]);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'documents', label: 'Documents', icon: '📄' },
        { id: 'licenses', label: 'Licenses', icon: '📋' },
        { id: 'maintenance', label: 'Maintenance', icon: '🔧' }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
            case 'Valid':
            case 'Completed':
                return 'bg-green-100 text-green-800 [data-theme=\'dark\']_&:bg-green-900 [data-theme=\'dark\']_&:text-green-200';
            case 'Expiring Soon':
                return 'bg-orange-100 text-orange-800 [data-theme=\'dark\']_&:bg-orange-900 [data-theme=\'dark\']_&:text-orange-200';
            case 'Expired':
            case 'Inactive':
                return 'bg-red-100 text-red-800 [data-theme=\'dark\']_&:bg-red-900 [data-theme=\'dark\']_&:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 [data-theme=\'dark\']_&:bg-gray-700 [data-theme=\'dark\']_&:text-gray-200';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
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
        if (onEdit && vesselId) {
            onEdit(vesselId);
        }
    };

    if (!isVisible || !vesselId) return null;

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
                        {/* Vessel Icon */}
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 [data-theme='dark']_&:text-white">{vesselDetails.name}</h2>
                            <div className="flex items-center space-x-3 mt-1">
                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(vesselDetails.status)}`}>
                                    {vesselDetails.status}
                                </span>
                                <span className="text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">
                                    {vesselDetails.imo}
                                </span>
                                <span className="text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">
                                    {vesselDetails.vesselType}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleEdit}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-150 text-sm"
                        >
                            Edit Vessel
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

                {/* Quick Info Bar */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:border-gray-600">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500 [data-theme='dark']_&:text-gray-400">Company:</span>
                            <p className="font-medium [data-theme='dark']_&:text-gray-200">{vesselDetails.company}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 [data-theme='dark']_&:text-gray-400">Flag:</span>
                            <p className="font-medium [data-theme='dark']_&:text-gray-200">{vesselDetails.flag}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 [data-theme='dark']_&:text-gray-400">Current Port:</span>
                            <p className="font-medium [data-theme='dark']_&:text-gray-200">{vesselDetails.port}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 [data-theme='dark']_&:text-gray-400">Year Built:</span>
                            <p className="font-medium [data-theme='dark']_&:text-gray-200">{vesselDetails.yearOfBuild}</p>
                        </div>
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
                            {/* Vessel Image and Specs */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Vessel Image */}
                                <div>
                                    <h4 className="font-semibold text-gray-800 [data-theme='dark']_&:text-gray-200 mb-3">Vessel Image</h4>
                                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center [data-theme='dark']_&:bg-gray-600">
                                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Key Metrics */}
                                <div>
                                    <h4 className="font-semibold text-gray-800 [data-theme='dark']_&:text-gray-200 mb-3">Key Specifications</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-blue-50 p-3 rounded-lg [data-theme='dark']_&:bg-blue-900">
                                            <p className="text-xs text-blue-600 [data-theme='dark']_&:text-blue-300">Gross Tonnage</p>
                                            <p className="text-lg font-bold text-blue-900 [data-theme='dark']_&:text-blue-100">{vesselDetails.grossTonnage.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-green-50 p-3 rounded-lg [data-theme='dark']_&:bg-green-900">
                                            <p className="text-xs text-green-600 [data-theme='dark']_&:text-green-300">Deadweight</p>
                                            <p className="text-lg font-bold text-green-900 [data-theme='dark']_&:text-green-100">{vesselDetails.summerDeadweight.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-purple-50 p-3 rounded-lg [data-theme='dark']_&:bg-purple-900">
                                            <p className="text-xs text-purple-600 [data-theme='dark']_&:text-purple-300">Engine Power</p>
                                            <p className="text-lg font-bold text-purple-900 [data-theme='dark']_&:text-purple-100">{vesselDetails.enginePower.toLocaleString()} HP</p>
                                        </div>
                                        <div className="bg-orange-50 p-3 rounded-lg [data-theme='dark']_&:bg-orange-900">
                                            <p className="text-xs text-orange-600 [data-theme='dark']_&:text-orange-300">Crew Size</p>
                                            <p className="text-lg font-bold text-orange-900 [data-theme='dark']_&:text-orange-100">{vesselDetails.crew}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Information */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Identification */}
                                <div className="bg-gray-50 p-4 rounded-lg [data-theme='dark']_&:bg-gray-700">
                                    <h4 className="font-semibold text-gray-800 [data-theme='dark']_&:text-gray-200 mb-3">Identification</h4>
                                    <div className="space-y-2 text-sm">
                                        <div><span className="text-gray-600 [data-theme='dark']_&:text-gray-400">IMO:</span> <span className="font-medium [data-theme='dark']_&:text-gray-200">{vesselDetails.imo}</span></div>
                                        <div><span className="text-gray-600 [data-theme='dark']_&:text-gray-400">MMSI:</span> <span className="font-medium [data-theme='dark']_&:text-gray-200">{vesselDetails.mmsi}</span></div>
                                        <div><span className="text-gray-600 [data-theme='dark']_&:text-gray-400">Callsign:</span> <span className="font-medium [data-theme='dark']_&:text-gray-200">{vesselDetails.callsign}</span></div>
                                        <div><span className="text-gray-600 [data-theme='dark']_&:text-gray-400">Flag:</span> <span className="font-medium [data-theme='dark']_&:text-gray-200">{vesselDetails.flag}</span></div>
                                        <div><span className="text-gray-600 [data-theme='dark']_&:text-gray-400">Previous Name:</span> <span className="font-medium [data-theme='dark']_&:text-gray-200">{vesselDetails.previousName}</span></div>
                                    </div>
                                </div>

                                {/* Technical Specifications */}
                                <div className="bg-gray-50 p-4 rounded-lg [data-theme='dark']_&:bg-gray-700">
                                    <h4 className="font-semibold text-gray-800 [data-theme='dark']_&:text-gray-200 mb-3">Technical Specs</h4>
                                    <div className="space-y-2 text-sm">
                                        <div><span className="text-gray-600 [data-theme='dark']_&:text-gray-400">Length:</span> <span className="font-medium [data-theme='dark']_&:text-gray-200">{vesselDetails.length} m</span></div>
                                        <div><span className="text-gray-600 [data-theme='dark']_&:text-gray-400">Width:</span> <span className="font-medium [data-theme='dark']_&:text-gray-200">{vesselDetails.width} m</span></div>
                                        <div><span className="text-gray-600 [data-theme='dark']_&:text-gray-400">Draft:</span> <span className="font-medium [data-theme='dark']_&:text-gray-200">{vesselDetails.draft} m</span></div>
                                        <div><span className="text-gray-600 [data-theme='dark']_&:text-gray-400">Fuel Type:</span> <span className="font-medium [data-theme='dark']_&:text-gray-200">{vesselDetails.fuelType}</span></div>
                                        <div><span className="text-gray-600 [data-theme='dark']_&:text-gray-400">Classification:</span> <span className="font-medium [data-theme='dark']_&:text-gray-200">{vesselDetails.vesselClass}</span></div>
                                    </div>
                                </div>

                                {/* Operational Info */}
                                <div className="bg-gray-50 p-4 rounded-lg [data-theme='dark']_&:bg-gray-700">
                                    <h4 className="font-semibold text-gray-800 [data-theme='dark']_&:text-gray-200 mb-3">Operational Info</h4>
                                    <div className="space-y-2 text-sm">
                                        <div><span className="text-gray-600 [data-theme='dark']_&:text-gray-400">Owner:</span> <span className="font-medium [data-theme='dark']_&:text-gray-200">{vesselDetails.owner}</span></div>
                                        <div><span className="text-gray-600 [data-theme='dark']_&:text-gray-400">Operator:</span> <span className="font-medium [data-theme='dark']_&:text-gray-200">{vesselDetails.operator}</span></div>
                                        <div><span className="text-gray-600 [data-theme='dark']_&:text-gray-400">Registration:</span> <span className="font-medium [data-theme='dark']_&:text-gray-200">{vesselDetails.registrationDate}</span></div>
                                        <div><span className="text-gray-600 [data-theme='dark']_&:text-gray-400">Last Update:</span> <span className="font-medium [data-theme='dark']_&:text-gray-200">{vesselDetails.lastUpdate}</span></div>
                                        <div><span className="text-gray-600 [data-theme='dark']_&:text-gray-400">Next Inspection:</span> <span className="font-medium [data-theme='dark']_&:text-gray-200">{vesselDetails.nextInspection}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Documents Tab */}
                    {activeTab === 'documents' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800 [data-theme='dark']_&:text-gray-200">Documents</h3>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-150 text-sm">
                                    Add Document
                                </button>
                            </div>
                            <div className="bg-white rounded-lg overflow-hidden [data-theme='dark']_&:bg-gray-700">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 [data-theme='dark']_&:bg-gray-600">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Document Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Expiry Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 [data-theme='dark']_&:text-gray-300 uppercase tracking-wider">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white [data-theme='dark']_&:bg-gray-700 divide-y divide-gray-200 [data-theme='dark']_&:divide-gray-600">
                                        {vesselDetails.documents.map((doc) => (
                                            <tr key={doc.id} className="hover:bg-gray-50 [data-theme='dark']_&:hover:bg-gray-600 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 [data-theme='dark']_&:text-white">{doc.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 [data-theme='dark']_&:text-gray-300">{doc.type}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 [data-theme='dark']_&:text-gray-300">{doc.expiryDate}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                                                        {doc.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                                    <button className="text-blue-600 hover:text-blue-900 [data-theme='dark']_&:text-blue-400 [data-theme='dark']_&:hover:text-blue-300 transition-colors duration-150">View</button>
                                                    <button className="text-green-600 hover:text-green-900 [data-theme='dark']_&:text-green-400 [data-theme='dark']_&:hover:text-green-300 transition-colors duration-150">Download</button>
                                                    <button className="text-red-600 hover:text-red-900 [data-theme='dark']_&:text-red-400 [data-theme='dark']_&:hover:text-red-300 transition-colors duration-150">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Licenses Tab */}
                    {activeTab === 'licenses' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800 [data-theme='dark']_&:text-gray-200">Licenses</h3>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-150 text-sm">
                                    Add License
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {vesselDetails.licenses.map((license) => (
                                    <div key={license.id} className="bg-gray-50 p-4 rounded-lg [data-theme='dark']_&:bg-gray-700">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-gray-800 [data-theme='dark']_&:text-gray-200">{license.name}</h4>
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(license.status)}`}>
                                                {license.status}
                                            </span>
                                        </div>
                                        <div className="space-y-1 text-sm text-gray-600 [data-theme='dark']_&:text-gray-400">
                                            <div>Issue Date: {license.issueDate}</div>
                                            <div>Expiry Date: {license.expiryDate}</div>
                                        </div>
                                        <div className="mt-3 flex space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900 text-sm [data-theme='dark']_&:text-blue-400 [data-theme='dark']_&:hover:text-blue-300 transition-colors duration-150">View</button>
                                            <button className="text-green-600 hover:text-green-900 text-sm [data-theme='dark']_&:text-green-400 [data-theme='dark']_&:hover:text-green-300 transition-colors duration-150">Renew</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Maintenance Tab */}
                    {activeTab === 'maintenance' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800 [data-theme='dark']_&:text-gray-200">Maintenance History</h3>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-150 text-sm">
                                    Add Maintenance
                                </button>
                            </div>
                            <div className="space-y-4">
                                {vesselDetails.maintenanceHistory.map((maintenance) => (
                                    <div key={maintenance.id} className="bg-gray-50 p-4 rounded-lg [data-theme='dark']_&:bg-gray-700">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-800 [data-theme='dark']_&:text-gray-200">{maintenance.type}</h4>
                                                <p className="text-sm text-gray-600 [data-theme='dark']_&:text-gray-400 mt-1">{maintenance.description}</p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(maintenance.status)}`}>
                                                {maintenance.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm text-gray-600 [data-theme='dark']_&:text-gray-400 mt-3">
                                            <span>Date: {maintenance.date}</span>
                                            <span className="font-medium">Cost: {formatCurrency(maintenance.cost)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}