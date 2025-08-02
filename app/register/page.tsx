// app/register/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { LogoIcon } from '../dashboard/components/icons/Logos';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
        role: 'Superintendent',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const { state, register } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const roles = [
        'Superintendent',
        'Captain',
        'Chief Engineer',
        'Deck Officer',
        'Engineer Officer',
        'Port Manager',
        'Fleet Manager',
        'Operations Manager',
        'Ship Owner',
        'Ship Manager',
        'Crew Manager',
        'Safety Officer',
        'Quality Assurance Officer',
        'Maintenance Technician',
        'Logistics Coordinator',
        'Other',
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!formData.username || !formData.email || !formData.name || !formData.password) {
            setError('Please fill in all required fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        const registerData = {
            username: formData.username,
            email: formData.email,
            name: formData.name,
            password: formData.password,
            role: formData.role,
        };

        const success = await register(registerData);

        if (success) {
            setSuccess('Account created successfully! Please login with your credentials.');
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } else {
            setError('Registration failed. Please try again.');
        }
    };

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 [data-theme='dark']:from-gray-900 [data-theme='dark']:via-blue-900 [data-theme='dark']:to-indigo-900">
                <div className="animate-pulse">
                    <div className="h-16 w-16 bg-blue-200 [data-theme='dark']:bg-gray-700 rounded-full mx-auto"></div>
                    <div className="h-8 w-48 bg-blue-200 [data-theme='dark']:bg-gray-700 rounded mx-auto mt-6"></div>
                    <div className="h-4 w-32 bg-blue-200 [data-theme='dark']:bg-gray-700 rounded mx-auto mt-2"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 [data-theme='dark']:from-gray-900 [data-theme='dark']:via-blue-900 [data-theme='dark']:to-indigo-900">
                {/* Floating Shapes */}
                <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-40" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>

            <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-lg w-full">
                    {/* Register Card with Glassmorphism */}
                    <div className="backdrop-blur-xl bg-white/80 [data-theme='dark']:bg-gray-800/80 rounded-2xl shadow-2xl border border-white/20 [data-theme='dark']:border-gray-700/20 p-8 space-y-8 transform transition-all duration-300 hover:scale-[1.02]">
                        {/* Header Section */}
                        <div className="text-center">
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                                    <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-full shadow-lg transform transition-all duration-300 hover:rotate-6">
                                        <LogoIcon className="h-12 w-12 text-white"/>
                                    </div>
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 [data-theme='dark']:from-white [data-theme='dark']:to-gray-300 bg-clip-text text-transparent">
                                Create Account
                            </h2>
                            <p className="mt-2 text-sm text-gray-600 [data-theme='dark']:text-gray-400">
                                Join the Maintena Sync Dashboard
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Username and Name Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('username')}
                                        onBlur={() => setFocusedField(null)}
                                        className="peer w-full px-4 py-3 bg-white/50 [data-theme='dark']:bg-gray-700/50 border border-gray-200 [data-theme='dark']:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-transparent text-gray-900 [data-theme='dark']:text-white pr-12"
                                        // placeholder="Username"
                                    />
                                    <label
                                        htmlFor="username"
                                        className={`absolute left-4 transition-all duration-300 pointer-events-none text-gray-500 [data-theme='dark']:text-gray-400 ${
                                            focusedField === 'username' || formData.username
                                                ? '-top-2 text-xs bg-white [data-theme=\'dark\']:bg-gray-800 px-2 rounded text-blue-600 [data-theme=\'dark\']:text-blue-400'
                                                : 'top-3 text-sm'
                                        }`}
                                    >
                                        Username *
                                    </label>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <svg className="h-5 w-5 text-gray-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="relative">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                        className="peer w-full px-4 py-3 bg-white/50 [data-theme='dark']:bg-gray-700/50 border border-gray-200 [data-theme='dark']:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-transparent text-gray-900 [data-theme='dark']:text-white pr-12"
                                        // placeholder="Full Name"
                                    />
                                    <label
                                        htmlFor="name"
                                        className={`absolute left-4 transition-all duration-300 pointer-events-none text-gray-500 [data-theme='dark']:text-gray-400 ${
                                            focusedField === 'name' || formData.name
                                                ? '-top-2 text-xs bg-white [data-theme=\'dark\']:bg-gray-800 px-2 rounded text-blue-600 [data-theme=\'dark\']:text-blue-400'
                                                : 'top-3 text-sm'
                                        }`}
                                    >
                                        Full Name *
                                    </label>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <svg className="h-5 w-5 text-gray-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    className="peer w-full px-4 py-3 bg-white/50 [data-theme='dark']:bg-gray-700/50 border border-gray-200 [data-theme='dark']:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-transparent text-gray-900 [data-theme='dark']:text-white pr-12"
                                    // placeholder="Email Address"
                                />
                                <label
                                    htmlFor="email"
                                    className={`absolute left-4 transition-all duration-300 pointer-events-none text-gray-500 [data-theme='dark']:text-gray-400 ${
                                        focusedField === 'email' || formData.email
                                            ? '-top-2 text-xs bg-white [data-theme=\'dark\']:bg-gray-800 px-2 rounded text-blue-600 [data-theme=\'dark\']:text-blue-400'
                                            : 'top-3 text-sm'
                                    }`}
                                >
                                    Email Address *
                                </label>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <svg className="h-5 w-5 text-gray-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                            </div>

                            {/* Role Field */}
                            <div className="relative">
                                <select
                                    id="role"
                                    name="role"
                                    required
                                    value={formData.role}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('role')}
                                    onBlur={() => setFocusedField(null)}
                                    className="peer w-full px-4 py-3 bg-white/50 [data-theme='dark']:bg-gray-700/50 border border-gray-200 [data-theme='dark']:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 [data-theme='dark']:text-white pr-12"
                                >
                                    {roles.map((role) => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                                <label
                                    htmlFor="role"
                                    className="absolute -top-2 left-4 text-xs bg-white [data-theme='dark']:bg-gray-800 px-2 rounded text-blue-600 [data-theme='dark']:text-blue-400 transition-all duration-300"
                                >
                                    Role *
                                </label>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <svg className="h-5 w-5 text-gray-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Password Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        className="peer w-full px-4 py-3 bg-white/50 [data-theme='dark']:bg-gray-700/50 border border-gray-200 [data-theme='dark']:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-transparent text-gray-900 [data-theme='dark']:text-white pr-12"
                                        // placeholder="Password"
                                    />
                                    <label
                                        htmlFor="password"
                                        className={`absolute left-4 transition-all duration-300 pointer-events-none text-gray-500 [data-theme='dark']:text-gray-400 ${
                                            focusedField === 'password' || formData.password
                                                ? '-top-2 text-xs bg-white [data-theme=\'dark\']:bg-gray-800 px-2 rounded text-blue-600 [data-theme=\'dark\']:text-blue-400'
                                                : 'top-3 text-sm'
                                        }`}
                                    >
                                        Password *
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 [data-theme='dark']:hover:text-gray-300 transition-colors duration-300"
                                    >
                                        {showPassword ? (
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('confirmPassword')}
                                        onBlur={() => setFocusedField(null)}
                                        className="peer w-full px-4 py-3 bg-white/50 [data-theme='dark']:bg-gray-700/50 border border-gray-200 [data-theme='dark']:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-transparent text-gray-900 [data-theme='dark']:text-white pr-12"
                                        // placeholder="Confirm Password"
                                    />
                                    <label
                                        htmlFor="confirmPassword"
                                        className={`absolute left-4 transition-all duration-300 pointer-events-none text-gray-500 [data-theme='dark']:text-gray-400 ${
                                            focusedField === 'confirmPassword' || formData.confirmPassword
                                                ? '-top-2 text-xs bg-white [data-theme=\'dark\']:bg-gray-800 px-2 rounded text-blue-600 [data-theme=\'dark\']:text-blue-400'
                                                : 'top-3 text-sm'
                                        }`}
                                    >
                                        Confirm Password *
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 [data-theme='dark']:hover:text-gray-300 transition-colors duration-300"
                                    >
                                        {showConfirmPassword ? (
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 [data-theme='dark']:bg-red-900/20 border border-red-200 [data-theme='dark']:border-red-800 rounded-xl p-4 animate-shake">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-700 [data-theme='dark']:text-red-300">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Success Message */}
                            {success && (
                                <div className="bg-green-50 [data-theme='dark']:bg-green-900/20 border border-green-200 [data-theme='dark']:border-green-800 rounded-xl p-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-green-700 [data-theme='dark']:text-green-300">{success}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Sign Up Button */}
                            <button
                                type="submit"
                                disabled={state.isLoading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    {state.isLoading ? (
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5 text-white group-hover:text-blue-100 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-9a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                </span>
                                {state.isLoading ? 'Creating Account...' : 'Create Account'}
                            </button>

                            {/* Sign In Link */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600 [data-theme='dark']:text-gray-400">
                                    Already have an account?{' '}
                                    <Link 
                                        href="/login" 
                                        className="font-medium text-blue-600 hover:text-blue-500 [data-theme='dark']:text-blue-400 [data-theme='dark']:hover:text-blue-300 transition-colors duration-300 hover:underline"
                                    >
                                        Sign in here
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-500 [data-theme='dark']:text-gray-400">
                            © 2024 Nautipro Connect Solutions. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                @keyframes shake {
                    0%, 100% {
                        transform: translateX(0);
                    }
                    10%, 30%, 50%, 70%, 90% {
                        transform: translateX(-2px);
                    }
                    20%, 40%, 60%, 80% {
                        transform: translateX(2px);
                    }
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
}
