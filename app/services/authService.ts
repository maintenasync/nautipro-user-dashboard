// services/authService.ts

import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth';

const BASE_URL = 'https://auth.nautiproconnect.com/api/v1/web';
const API_KEY = '12345678';

class AuthService {
    private getHeaders() {
        return {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
        };
    }

    async login(credentials: LoginRequest): Promise<AuthResponse> {
        try {
            const response = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                throw new Error(`Login failed: ${response.status}`);
            }

            const data: AuthResponse = await response.json();

            // Store token in localStorage for global access
            if (data.data.token) {
                localStorage.setItem('auth_token', data.data.token);
                localStorage.setItem('refresh_token', data.data.refresh_token);
                localStorage.setItem('user_data', JSON.stringify(data.data));
            }

            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async register(userData: RegisterRequest): Promise<AuthResponse> {
        try {
            const response = await fetch(`${BASE_URL}/register-user`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error(`Registration failed: ${response.status}`);
            }

            const data: AuthResponse = await response.json();
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    // Get stored token for API requests
    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('auth_token');
        }
        return null;
    }

    // Get stored user data
    getUserData(): User | null {
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('user_data');
            return userData ? JSON.parse(userData) : null;
        }
        return null;
    }

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    // Logout function
    logout(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_data');
        }
    }

    // Get headers with authorization for API requests
    getAuthHeaders() {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            ...(token && { 'Authorization': `Bearer ${token}` }),
        };
    }
}

export const authService = new AuthService();
export default authService;