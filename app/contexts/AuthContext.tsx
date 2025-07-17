// contexts/AuthContext.tsx

'use client';

import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { AuthState, User, LoginRequest, RegisterRequest } from '../types/auth';
import authService from '../services/authService';

// Auth Actions
type AuthAction =
    | { type: 'LOGIN_START' }
    | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
    | { type: 'LOGIN_FAILURE' }
    | { type: 'REGISTER_START' }
    | { type: 'REGISTER_SUCCESS' }
    | { type: 'REGISTER_FAILURE' }
    | { type: 'LOGOUT' }
    | { type: 'SET_USER'; payload: { user: User; token: string } }
    | { type: 'INITIALIZE_AUTH_COMPLETE' };

// Initial state
const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    isInitialized: false,
};

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'LOGIN_START':
        case 'REGISTER_START':
            return {
                ...state,
                isLoading: true,
            };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false,
                isInitialized: true,
            };
        case 'REGISTER_SUCCESS':
            return {
                ...state,
                isLoading: false,
            };
        case 'LOGIN_FAILURE':
        case 'REGISTER_FAILURE':
            return {
                ...state,
                isLoading: false,
                isInitialized: true,
            };
        case 'LOGOUT':
            return {
                ...initialState,
                isInitialized: true,
            };
        case 'SET_USER':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                isInitialized: true,
            };
        case 'INITIALIZE_AUTH_COMPLETE': // <-- Case baru
            return {
                ...state,
                isInitialized: true,
            };
        default:
            return state;
    }
}

// Context type
interface AuthContextType {
    state: AuthState;
    login: (credentials: LoginRequest) => Promise<boolean>;
    register: (userData: RegisterRequest) => Promise<boolean>;
    logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check for existing authentication on mount
    useEffect(() => {
        const token = authService.getToken();
        const userData = authService.getUserData();

        if (token && userData) {
            dispatch({
                type: 'SET_USER',
                payload: {
                    user: {
                        id: userData.id,
                        name: userData.name,
                        username: userData.username,
                        email: userData.email,
                        role: userData.role,
                        avatar: userData.avatar,
                        license: userData.license,
                    },
                    token,
                },
            });
        }else {
            // Penting: Ini dijalankan jika tidak ada token,
            // menandakan bahwa proses inisialisasi dari localStorage sudah selesai
            dispatch({ type: 'INITIALIZE_AUTH_COMPLETE' });
        }
    }, []);

    const login = async (credentials: LoginRequest): Promise<boolean> => {
        dispatch({ type: 'LOGIN_START' });

        try {
            const response = await authService.login(credentials);

            if (response.code === 200) {
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: {
                        user: {
                            id: response.data.id,
                            name: response.data.name,
                            username: response.data.username,
                            email: response.data.email,
                            role: response.data.role,
                            avatar: response.data.avatar,
                            license: response.data.license,
                        },
                        token: response.data.token,
                    },
                });
                return true;
            } else {
                dispatch({ type: 'LOGIN_FAILURE' });
                return false;
            }
        } catch (error : unknown) {
            dispatch({ type: 'LOGIN_FAILURE' });
            console.error('Login error:', error);
            return false;
        }
    };

    const register = async (userData: RegisterRequest): Promise<boolean> => {
        dispatch({ type: 'REGISTER_START' });

        try {
            const response = await authService.register(userData);

            if (response.code === 200) {
                dispatch({ type: 'REGISTER_SUCCESS' });
                return true;
            } else {
                dispatch({ type: 'REGISTER_FAILURE' });
                return false;
            }
        } catch (error: unknown) {
            dispatch({ type: 'REGISTER_FAILURE' });
            console.error('Registration error:', error);
            return false;
        }
    };

    const logout = () => {
        authService.logout();
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider value={{ state, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}