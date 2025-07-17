// app/dashboard/components/pages/NotificationSetting.tsx

'use client';

import { useState } from 'react';

interface NotificationSettings {
    email: {
        enabled: boolean;
        address: string;
    };
    telegram: {
        enabled: boolean;
        username: string;
    };
    whatsapp: {
        enabled: boolean;
        number: string;
    };
}

export default function NotificationSetting() {
    const [settings, setSettings] = useState<NotificationSettings>({
        email: {
            enabled: true,
            address: 'user@example.com'
        },
        telegram: {
            enabled: true,
            username: '@maritime_user'
        },
        whatsapp: {
            enabled: false,
            number: '+628123456789'
        }
    });

    const handleToggle = (type: keyof NotificationSettings) => {
        setSettings(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                enabled: !prev[type].enabled
            }
        }));
    };

    const handleUpdate = (type: keyof NotificationSettings, field: string, value: string) => {
        setSettings(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [field]: value
            }
        }));
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Notification Settings</h1>

            <div className="space-y-6">
                {/* Email Notification */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Email Notifications</h3>
                                <p className="text-sm text-gray-600">Receive alerts via email</p>
                            </div>
                        </div>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.email.enabled}
                                onChange={() => handleToggle('email')}
                                className="sr-only"
                            />
                            <div className={`relative w-12 h-6 transition-colors duration-200 ease-in-out rounded-full ${
                                settings.email.enabled ? 'bg-blue-500' : 'bg-gray-300'
                            }`}>
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 transition-transform duration-200 ease-in-out transform bg-white rounded-full ${
                                    settings.email.enabled ? 'translate-x-6' : 'translate-x-0'
                                }`}></div>
                            </div>
                        </label>
                    </div>
                    {settings.email.enabled && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={settings.email.address}
                                onChange={(e) => handleUpdate('email', 'address', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}
                </div>

                {/* Telegram Notification */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Telegram Notifications</h3>
                                <p className="text-sm text-gray-600">Receive alerts via Telegram</p>
                            </div>
                        </div>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.telegram.enabled}
                                onChange={() => handleToggle('telegram')}
                                className="sr-only"
                            />
                            <div className={`relative w-12 h-6 transition-colors duration-200 ease-in-out rounded-full ${
                                settings.telegram.enabled ? 'bg-blue-500' : 'bg-gray-300'
                            }`}>
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 transition-transform duration-200 ease-in-out transform bg-white rounded-full ${
                                    settings.telegram.enabled ? 'translate-x-6' : 'translate-x-0'
                                }`}></div>
                            </div>
                        </label>
                    </div>
                    {settings.telegram.enabled && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Telegram Username</label>
                            <input
                                type="text"
                                value={settings.telegram.username}
                                onChange={(e) => handleUpdate('telegram', 'username', e.target.value)}
                                placeholder="@username"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}
                </div>

                {/* WhatsApp Notification */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.715"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">WhatsApp Notifications</h3>
                                <p className="text-sm text-gray-600">Receive alerts via WhatsApp</p>
                            </div>
                        </div>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.whatsapp.enabled}
                                onChange={() => handleToggle('whatsapp')}
                                className="sr-only"
                            />
                            <div className={`relative w-12 h-6 transition-colors duration-200 ease-in-out rounded-full ${
                                settings.whatsapp.enabled ? 'bg-green-500' : 'bg-gray-300'
                            }`}>
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 transition-transform duration-200 ease-in-out transform bg-white rounded-full ${
                                    settings.whatsapp.enabled ? 'translate-x-6' : 'translate-x-0'
                                }`}></div>
                            </div>
                        </label>
                    </div>
                    {settings.whatsapp.enabled && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                            <input
                                type="tel"
                                value={settings.whatsapp.number}
                                onChange={(e) => handleUpdate('whatsapp', 'number', e.target.value)}
                                placeholder="+628123456789"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    )}
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
}