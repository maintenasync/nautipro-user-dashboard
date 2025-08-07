import React, { useState, useEffect } from 'react';
import { X, User, AlertCircle, Check } from 'lucide-react';

interface ChangeNameDialogProps {
    isOpen: boolean;
    onClose: () => void;
    currentName: string;
    onSuccess: (newName: string) => void;
}

const ChangeNameDialog: React.FC<ChangeNameDialogProps> = ({
                                                               isOpen,
                                                               onClose,
                                                               currentName,
                                                               onSuccess
                                                           }) => {
    const [newName, setNewName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setNewName(currentName);
            setError('');
            setSuccess(false);
        }
    }, [isOpen, currentName]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newName.trim()) {
            setError('Name cannot be empty');
            return;
        }

        if (newName.trim() === currentName.trim()) {
            setError('New name must be different from current name');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('auth_token');
            const apiKey = '12345678';

            const response = await fetch('https://auth.nautiproconnect.com/api/v1/web/change-name', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey || '',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    new_name: newName.trim()
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to change name');
            }

            const result = await response.json();
            setSuccess(true);

            // Call success callback with new name
            setTimeout(() => {
                onSuccess(newName.trim());
                onClose();
            }, 1500);

        } catch (error: any) {
            setError(error.message || 'Failed to change name. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full [data-theme='dark']_&:bg-gray-800">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 [data-theme='dark']_&:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 [data-theme='dark']_&:text-white">
                        Change Name
                    </h3>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="p-1 text-gray-400 hover:text-gray-600 [data-theme='dark']_&:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {success ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 [data-theme='dark']_&:bg-green-900/30">
                                <Check className="w-8 h-8 text-green-600 [data-theme='dark']_&:text-green-400" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800 [data-theme='dark']_&:text-white mb-2">
                                Name Changed Successfully!
                            </h4>
                            <p className="text-gray-600 [data-theme='dark']_&:text-gray-400">
                                Your name has been updated to "{newName}"
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="newName" className="block text-sm font-medium text-gray-700 [data-theme='dark']_&:text-gray-300 mb-2">
                                    New Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="newName"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:border-gray-600 [data-theme='dark']_&:text-white [data-theme='dark']_&:placeholder-gray-400"
                                        placeholder="Enter your new name"
                                        disabled={isLoading}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg [data-theme='dark']_&:bg-red-900/20 [data-theme='dark']_&:border-red-800">
                                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                    <p className="text-sm text-red-600 [data-theme='dark']_&:text-red-400">
                                        {error}
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 [data-theme='dark']_&:bg-gray-700 [data-theme='dark']_&:text-gray-300 [data-theme='dark']_&:border-gray-600 [data-theme='dark']_&:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading || !newName.trim() || newName.trim() === currentName.trim()}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Changing...</span>
                                        </div>
                                    ) : (
                                        'Change Name'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ChangeNameDialog;