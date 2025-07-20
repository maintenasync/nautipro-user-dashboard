// app/dashboard/components/layout/TopBar.tsx

import {BellIcon, UserIcon } from '../icons/Icons';
import { useAuth } from '@/app/contexts/AuthContext';
import { useSafeTheme } from '@/app/hooks/useSafeTheme';
import { useState } from 'react';

interface MenuItem {
    id: string;
    label: string;
    icon: React.ComponentType;
    component: React.ComponentType;
}

interface TopBarProps {
    menuItems: MenuItem[];
    activeMenuItem: string;
    sidebarOpen?: boolean;
    setSidebarOpen?: (open: boolean) => void;
}

export default function TopBar({ menuItems, activeMenuItem , sidebarOpen, setSidebarOpen}: TopBarProps) {
    const { state, logout } = useAuth();
    const { theme, setTheme, mounted } = useSafeTheme();
    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
    };

    const themes = [
        {
            value: 'light' as const,
            label: 'Light',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
        },
        {
            value: 'dark' as const,
            label: 'Dark',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            ),
        },
        {
            value: 'auto' as const,
            label: 'Auto',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
        },
    ];

    const currentTheme = themes.find(t => t.value === theme) || themes[2];

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
        if (mounted) {
            setTheme(newTheme);
            setIsThemeMenuOpen(false);
        }
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-100 px-6 py-4 [data-theme='dark']_&:bg-gray-900 [data-theme='dark']_&:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-semibold text-gray-800 [data-theme='dark']_&:text-white">
                        {menuItems.find(item => item.id === activeMenuItem)?.label}
                    </h2>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Search */}
                    {/*<div className="relative">*/}
                    {/*    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />*/}
                    {/*    <input*/}
                    {/*        type="text"*/}
                    {/*        placeholder="Search..."*/}
                    {/*        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"*/}
                    {/*    />*/}
                    {/*</div>*/}

                    {/* Theme Toggle */}
                    {mounted && (
                        <div className="relative">
                            <button
                                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-150 flex items-center space-x-2 [data-theme='dark']_&:border-gray-600 [data-theme='dark']_&:hover:bg-gray-700 [data-theme='dark']_&:bg-gray-800"
                                aria-label="Toggle theme"
                            >
                                <span className="text-gray-600 [data-theme='dark']_&:text-gray-300">
                                    {currentTheme.icon}
                                </span>
                                <span className="text-sm font-medium text-gray-700 [data-theme='dark']_&:text-gray-200 hidden sm:inline">
                                    {currentTheme.label}
                                </span>
                                <svg
                                    className={`w-4 h-4 text-gray-400 transition-transform duration-150 ${isThemeMenuOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Theme Dropdown Menu */}
                            {isThemeMenuOpen && (
                                <>
                                    {/* Backdrop */}
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsThemeMenuOpen(false)}
                                    />

                                    {/* Menu */}
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 [data-theme='dark']_&:bg-gray-800 [data-theme='dark']_&:border-gray-600">
                                        <div className="py-1">
                                            {themes.map((themeOption) => (
                                                <button
                                                    key={themeOption.value}
                                                    onClick={() => handleThemeChange(themeOption.value)}
                                                    className={`w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-gray-50 transition-colors duration-150 [data-theme='dark']_&:hover:bg-gray-700 ${
                                                        theme === themeOption.value
                                                            ? 'bg-blue-50 text-blue-600 [data-theme=\'dark\']_&:bg-blue-900 [data-theme=\'dark\']_&:text-blue-300'
                                                            : 'text-gray-700 [data-theme=\'dark\']_&:text-gray-200'
                                                    }`}
                                                >
                                                    <span className="flex-shrink-0">
                                                        {themeOption.icon}
                                                    </span>
                                                    <span className="text-sm font-medium">
                                                        {themeOption.label}
                                                    </span>
                                                    {theme === themeOption.value && (
                                                        <svg className="w-4 h-4 ml-auto text-blue-600 [data-theme='dark']_&:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Info */}
                                        <div className="border-t border-gray-200 [data-theme='dark']_&:border-gray-600 px-4 py-3">
                                            <p className="text-xs text-gray-500 [data-theme='dark']_&:text-gray-400">
                                                {theme === 'auto'
                                                    ? 'Following system preference'
                                                    : `Using ${theme} mode`
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Notifications */}
                    {/*<button className="p-2 rounded-lg hover:bg-gray-100 relative [data-theme='dark']_&:hover:bg-gray-700">*/}
                    {/*    <BellIcon />*/}
                    {/*    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">*/}
                    {/*        3*/}
                    {/*    </span>*/}
                    {/*</button>*/}

                    {/* Profile Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 [data-theme='dark']_&:hover:bg-gray-700">
                            {state.user?.avatar ? (
                                <img
                                    src={state.user.avatar}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full"
                                />
                            ) : (
                                <UserIcon />
                            )}
                            <div className="text-left">
                                <span className="text-sm font-medium text-gray-700 block [data-theme='dark']_&:text-gray-200">
                                    {state.user?.name || 'User'}
                                </span>
                                <span className="text-xs text-gray-500 [data-theme='dark']_&:text-gray-400">
                                    {state.user?.role || 'Role'}
                                </span>
                            </div>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md border-gray-100 shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 [data-theme='dark']_&:bg-gray-800 border border-gray-200 [data-theme='dark']_&:border-gray-600">
                            <div className="px-4 py-2 border-b [data-theme='dark']_&:border-gray-600">
                                <p className="text-sm font-medium text-gray-900 [data-theme='dark']_&:text-white">{state.user?.name}</p>
                                <p className="text-sm text-gray-500 [data-theme='dark']_&:text-gray-400">{state.user?.email}</p>
                            </div>
                            <a href="#" className="block px-4 py-2 border-gray-100 text-sm text-gray-700 hover:bg-gray-100 [data-theme='dark']_&:text-gray-200 [data-theme='dark']_&:hover:bg-gray-700">
                                Profile Settings
                            </a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 [data-theme='dark']_&:text-gray-200 [data-theme='dark']_&:hover:bg-gray-700">
                                Account Settings
                            </a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 [data-theme='dark']_&:text-gray-200 [data-theme='dark']_&:hover:bg-gray-700">
                                Help & Support
                            </a>
                            <div className="border-t [data-theme='dark']_&:border-gray-100">
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 [data-theme='dark']_&:text-red-400 [data-theme='dark']_&:hover:bg-gray-700"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}