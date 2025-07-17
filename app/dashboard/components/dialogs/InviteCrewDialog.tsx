// app/dashboard/components/dialogs/InviteCrewDialog.tsx

'use client';

import { useState, useEffect } from 'react';
import crewService, { InviteCrewRequest } from '../../../services/crewService';

interface InviteCrewDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface Role {
    label: string;
    code: string;
}

interface Company {
    id: string;
    name: string;
}

interface Vessel {
    id: string;
    name: string;
    company_id: string;
}

export default function InviteCrewDialog({ isOpen, onClose, onSuccess }: InviteCrewDialogProps) {
    const [formData, setFormData] = useState({
        company_id: '',
        vessel_id: '',
        email: '',
        user_role_code: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Animation states
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Prevent body scroll when dialog is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setIsVisible(true);
            // Small delay to trigger animation after render
            setTimeout(() => setIsAnimating(true), 10);
        } else {
            document.body.style.overflow = 'unset';
            setIsAnimating(false);
            // Wait for exit animation to complete before hiding
            setTimeout(() => setIsVisible(false), 200);
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Mock data - in real app, this would come from API
    const roles: Role[] = [
        { label: 'Captain', code: 'captain' },
        { label: 'Chief Engineer', code: 'chief_engineer' },
        { label: 'Chief Officer', code: 'chief_officer' },
        { label: 'Crew Deck', code: 'crew_deck' },
        { label: 'Crew Engine', code: 'crew_engine' },
        { label: 'Superintendent', code: 'superintendent' },
        { label: 'Safety Officer', code: 'safety_officer' },
        { label: 'Radio Officer', code: 'radio_officer' },
        { label: 'Bosun', code: 'bosun' },
        { label: 'Able Seaman', code: 'able_seaman' },
        { label: 'Ordinary Seaman', code: 'ordinary_seaman' },
        { label: 'Cook', code: 'cook' },
        { label: 'Steward', code: 'steward' },
    ];

    const companies: Company[] = [
        { id: '65219b60-ac4e-45f5-988b-9039e3ef4caf', name: 'Ocean Shipping Ltd' },
        { id: 'f1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Maritime Solutions Inc' },
        { id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', name: 'Global Fleet Management' },
    ];

    const vessels: Vessel[] = [
        { id: '5cb5add0-add5-445a-aeaf-9b44714e28a2', name: 'Ocean Explorer', company_id: '65219b60-ac4e-45f5-988b-9039e3ef4caf' },
        { id: 'b2c3d4e5-f6a7-890b-cdef-123456789abc', name: 'Sea Pioneer', company_id: 'f1b2c3d4-e5f6-7890-abcd-ef1234567890' },
        { id: 'c3d4e5f6-a7b8-901c-def2-3456789abcde', name: 'Wave Rider', company_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' },
        { id: 'd4e5f6a7-b8c9-012d-ef34-56789abcdef0', name: 'Deep Blue', company_id: '65219b60-ac4e-45f5-988b-9039e3ef4caf' },
        { id: 'e5f6a7b8-c901-23de-f456-789abcdef012', name: 'Star Navigator', company_id: 'f1b2c3d4-e5f6-7890-abcd-ef1234567890' },
    ];

    // Filter vessels based on selected company
    const filteredVessels = formData.company_id
        ? vessels.filter(vessel => vessel.company_id === formData.company_id)
        : [];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Reset vessel when company changes
            ...(name === 'company_id' && { vessel_id: '' })
        }));
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        // Validation
        if (!formData.company_id || !formData.vessel_id || !formData.email || !formData.user_role_code) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        try {
            const response = await crewService.inviteCrewMember(formData as InviteCrewRequest);

            if (response.code === 200) {
                setSuccess('Invitation sent successfully!');
                setTimeout(() => {
                    onSuccess();
                    handleClose();
                }, 2000);
            } else {
                setError(response.message || 'Failed to send invitation');
            }
        } catch (error) {
            setError('Failed to send invitation. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            company_id: '',
            vessel_id: '',
            email: '',
            user_role_code: '',
        });
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
                className={`bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-all duration-200 ease-out ${
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
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Invite New Crew Member</h3>
                                <p className="text-sm text-gray-500">Send an invitation to join the vessel crew</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors duration-150"
                            type="button"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                                placeholder="Enter crew member's email"
                            />
                        </div>

                        {/* Company */}
                        <div>
                            <label htmlFor="company_id" className="block text-sm font-medium text-gray-700 mb-1">
                                Company <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="company_id"
                                name="company_id"
                                required
                                value={formData.company_id}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                            >
                                <option value="">Select Company</option>
                                {companies.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Vessel */}
                        <div>
                            <label htmlFor="vessel_id" className="block text-sm font-medium text-gray-700 mb-1">
                                Vessel <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="vessel_id"
                                name="vessel_id"
                                required
                                value={formData.vessel_id}
                                onChange={handleInputChange}
                                disabled={!formData.company_id}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-150"
                            >
                                <option value="">
                                    {!formData.company_id ? 'Select Company First' : 'Select Vessel'}
                                </option>
                                {filteredVessels.map((vessel) => (
                                    <option key={vessel.id} value={vessel.id}>
                                        {vessel.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Role */}
                        <div>
                            <label htmlFor="user_role_code" className="block text-sm font-medium text-gray-700 mb-1">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="user_role_code"
                                name="user_role_code"
                                required
                                value={formData.user_role_code}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                            >
                                <option value="">Select Role</option>
                                {roles.map((role) => (
                                    <option key={role.code} value={role.code}>
                                        {role.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3 animate-pulse">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="bg-green-50 border border-green-200 rounded-md p-3 animate-pulse">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-green-700">{success}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
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
                                        Sending...
                                    </div>
                                ) : (
                                    'Send Invitation'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Info */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-blue-700">
                                    An invitation email will be sent to the specified email address with instructions to join the vessel crew.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}