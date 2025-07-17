// app/dashboard/components/dialogs/CreateVesselDialog.tsx

'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";

interface CreateVesselDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (vesselData: {
        name: string;
        previousName: string;
        imo: string;
        mmsi: string;
        flag: string;
        callsign: string;
        grossTonnage: string;
        summerDeadweight: string;
        yearOfBuild: string;
        vesselType: string;
        vesselClass: string;
        company: string;
        image: File | null;
    }) => void;
}

export default function CreateVesselDialog({ isOpen, onClose, onSubmit }: CreateVesselDialogProps) {
    const [formData, setFormData] = useState({
        name: '',
        previousName: '',
        imo: '',
        mmsi: '',
        flag: '',
        callsign: '',
        grossTonnage: '',
        summerDeadweight: '',
        yearOfBuild: '',
        vesselType: '',
        vesselClass: '',
        company: '',
        image: null as File | null
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Animation states
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Handle dialog visibility with animation
    useEffect(() => {
        if (isOpen) {
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
    }, [isOpen]);

    const vesselTypes = [
        'Cargo Ship',
        'Tanker',
        'Container Ship',
        'Bulk Carrier',
        'Passenger Ship',
        'Cruise Ship',
        'Ferry',
        'Fishing Vessel',
        'Offshore Supply Vessel',
        'Tugboat',
        'Barge',
        'Research Vessel',
        'Naval Ship',
        'Yacht',
        'Other'
    ];

    const vesselClasses = [
        'Lloyd\'s Register',
        'DNV GL',
        'American Bureau of Shipping (ABS)',
        'Bureau Veritas',
        'ClassNK',
        'Korean Register',
        'China Classification Society',
        'Russian Maritime Register',
        'Indian Register of Shipping',
        'Turkish Lloyd',
        'Other'
    ];

    const companies = [
        'Ocean Shipping Ltd',
        'Maritime Solutions Inc',
        'Global Fleet Management',
        'Pacific Marine Corp',
        'Atlantic Shipping Co'
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
        setSuccess('');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                setError('Image file size must be less than 5MB');
                return;
            }

            setFormData(prev => ({
                ...prev,
                image: file
            }));

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        // Validation
        if (!formData.name || !formData.vesselType) {
            setError('Please fill in all required fields');
            setIsLoading(false);
            return;
        }

        try {
            await onSubmit(formData);
            setSuccess('Vessel added successfully!');
            setTimeout(() => {
                handleClose();
            }, 1500);
        } catch (error) {
            console.error('Error adding vessel:', error);
            setError('Failed to add vessel. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            previousName: '',
            imo: '',
            mmsi: '',
            flag: '',
            callsign: '',
            grossTonnage: '',
            summerDeadweight: '',
            yearOfBuild: '',
            vesselType: '',
            vesselClass: '',
            company: '',
            image: null
        });
        setImagePreview(null);
        setError('');
        setSuccess('');
        setIsLoading(false);
        onClose();
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!isVisible) return null;

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
                className={`bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl transition-all duration-200 ease-out [data-theme='dark']_&:bg-gray-800 ${
                    isAnimating
                        ? 'scale-100 opacity-100 translate-y-0'
                        : 'scale-95 opacity-0 translate-y-4'
                }`}
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded-lg [data-theme='dark']_&:bg-blue-900">
                                <svg className="w-6 h-6 text-blue-600 [data-theme='dark']_&:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 [data-theme='dark']_&:text-white">Add New Vessel</h3>
                                <p className="text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">Add a new vessel to your fleet</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors duration-150 [data-theme='dark']_&:hover:bg-gray-700"
                            type="button"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Vessel Image */}
                        <div>
                            <h4 className="text-md font-semibold text-gray-800 mb-3 [data-theme='dark']_&:text-gray-200">Vessel Image</h4>
                            <div className="flex items-center space-x-4">
                                <div className="w-24 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center [data-theme='dark']_&:border-gray-600">
                                    {imagePreview ? (
                                        <Image src={imagePreview} alt="Vessel preview" className="w-full h-full object-cover rounded-lg" />
                                    ) : (
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="cursor-pointer bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 text-sm transition-colors duration-150"
                                    >
                                        Upload Image
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1 [data-theme='dark']_&:text-gray-400">JPG, PNG up to 5MB</p>
                                </div>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div>
                            <h4 className="text-md font-semibold text-gray-800 mb-3 [data-theme='dark']_&:text-gray-200">Basic Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 [data-theme='dark']_&:text-gray-300">
                                        Vessel Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 text-gray-900 placeholder-gray-400"
                                        placeholder="Enter vessel name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 [data-theme='dark']_&:text-gray-300">Previous Name</label>
                                    <input
                                        type="text"
                                        name="previousName"
                                        value={formData.previousName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 text-gray-900 placeholder-gray-400"
                                        placeholder="Previous vessel name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 [data-theme='dark']_&:text-gray-300">
                                        Vessel Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="vesselType"
                                        required
                                        value={formData.vesselType}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 text-gray-900"
                                    >
                                        <option value="">Select Vessel Type</option>
                                        {vesselTypes.map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 [data-theme='dark']_&:text-gray-300">Company</label>
                                    <select
                                        name="company"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 text-gray-900"
                                    >
                                        <option value="">Select Company</option>
                                        {companies.map((company) => (
                                            <option key={company} value={company}>{company}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Identification */}
                        <div>
                            <h4 className="text-md font-semibold text-gray-800 mb-3 [data-theme='dark']_&:text-gray-200">Identification</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 [data-theme='dark']_&:text-gray-300">IMO Number</label>
                                    <input
                                        type="text"
                                        name="imo"
                                        value={formData.imo}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 text-gray-900 placeholder-gray-400"
                                        placeholder="IMO1234567"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 [data-theme='dark']_&:text-gray-300">MMSI</label>
                                    <input
                                        type="text"
                                        name="mmsi"
                                        value={formData.mmsi}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 text-gray-900 placeholder-gray-400"
                                        placeholder="123456789"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 [data-theme='dark']_&:text-gray-300">Callsign</label>
                                    <input
                                        type="text"
                                        name="callsign"
                                        value={formData.callsign}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 text-gray-900 placeholder-gray-400"
                                        placeholder="ABC123"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 [data-theme='dark']_&:text-gray-300">Flag</label>
                                    <input
                                        type="text"
                                        name="flag"
                                        value={formData.flag}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 text-gray-900 placeholder-gray-400"
                                        placeholder="Country flag"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 [data-theme='dark']_&:text-gray-300">Year of Build</label>
                                    <input
                                        type="number"
                                        name="yearOfBuild"
                                        value={formData.yearOfBuild}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 text-gray-900 placeholder-gray-400"
                                        placeholder="2020"
                                        min="1900"
                                        max="2030"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 [data-theme='dark']_&:text-gray-300">Class</label>
                                    <select
                                        name="vesselClass"
                                        value={formData.vesselClass}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 text-gray-900"
                                    >
                                        <option value="">Select Class</option>
                                        {vesselClasses.map((vesselClass) => (
                                            <option key={vesselClass} value={vesselClass}>{vesselClass}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Technical Specifications */}
                        <div>
                            <h4 className="text-md font-semibold text-gray-800 mb-3 [data-theme='dark']_&:text-gray-200">Technical Specifications</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 [data-theme='dark']_&:text-gray-300">Gross Tonnage</label>
                                    <input
                                        type="number"
                                        name="grossTonnage"
                                        value={formData.grossTonnage}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 text-gray-900 placeholder-gray-400"
                                        placeholder="Enter gross tonnage"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 [data-theme='dark']_&:text-gray-300">Summer Deadweight</label>
                                    <input
                                        type="number"
                                        name="summerDeadweight"
                                        value={formData.summerDeadweight}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 text-gray-900 placeholder-gray-400"
                                        placeholder="Enter summer deadweight"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3 [data-theme='dark']_&:bg-red-900 [data-theme='dark']_&:border-red-700">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700 [data-theme='dark']_&:text-red-200">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="bg-green-50 border border-green-200 rounded-md p-3 [data-theme='dark']_&:bg-green-900 [data-theme='dark']_&:border-green-700">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-green-700 [data-theme='dark']_&:text-green-200">{success}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 [data-theme='dark']_&:border-gray-600">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:text-gray-200 [data-theme='dark']_&:border-gray-600 [data-theme='dark']_&:hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Adding...
                                    </div>
                                ) : (
                                    'Add Vessel'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}