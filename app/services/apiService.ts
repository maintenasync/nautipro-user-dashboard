// app/services/apiService.ts
import authService from './authService';
import type { ApiResponse, Company, Vessel, CrewMember, License } from '@/app/types/api';

const BASE_URL = 'https://auth.nautiproconnect.com/api/v1/web';

class ApiService {
    private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
        try {
            // Get auth headers from existing authService
            const headers = authService.getAuthHeaders();

            const response = await fetch(`${BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    ...headers,
                    ...options?.headers,
                },
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data: ApiResponse<T> = await response.json();

            if (data.code !== 200) {
                throw new Error(`API Error: ${data.code} ${data.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // Companies API
    async getCompanies(): Promise<ApiResponse<Company[]>> {
        return this.request<Company[]>('/companies');
    }

    async getCompany(id: string): Promise<ApiResponse<Company>> {
        // If you have single company endpoint, use it. Otherwise, filter from getCompanies
        const companies = await this.getCompanies();
        const company = companies.data.find(c => c.id === id);

        if (!company) {
            throw new Error('Company not found');
        }

        return {
            code: 200,
            status: 'OK',
            data: company
        };
    }

    // Vessels API
    async getVesselsByCompany(companyId: string): Promise<ApiResponse<Vessel[]>> {
        return this.request<Vessel[]>(`/get-vessels-by-company/${companyId}`);
    }

    async getVessel(vesselId: string): Promise<ApiResponse<Vessel>> {
        // You might need to add a single vessel endpoint, or derive from company vessels
        // For now, throwing an error - implement based on your backend capability
        throw new Error('Single vessel endpoint not implemented yet');
    }

    // Crews API
    async getCrewsByVessel(vesselId: string): Promise<ApiResponse<CrewMember[]>> {
        return this.request<CrewMember[]>(`/get-vessel-member-maintena-by-vessel/${vesselId}`);
    }

    async getCrewsByCompany(companyId: string): Promise<ApiResponse<CrewMember[]>> {
        return this.request<CrewMember[]>(`/get-vessels-member-maintena-by-company/${companyId}`);
    }

    // Licenses API
    async getLicenses(): Promise<ApiResponse<License[]>> {
        return this.request<License[]>('/get-license-maintena');
    }

    // Utility method to get all crews (if needed for crew management page)
    async getAllCrews(): Promise<ApiResponse<CrewMember[]>> {
        // This would need to be implemented based on your requirements
        // You might need to get all companies first, then their crews
        const companies = await this.getCompanies();
        const allCrews: CrewMember[] = [];

        for (const company of companies.data) {
            try {
                const crews = await this.getCrewsByCompany(company.id);
                allCrews.push(...crews.data);
            } catch (error) {
                console.warn(`Failed to fetch crews for company ${company.id}:`, error);
            }
        }

        return {
            code: 200,
            status: 'OK',
            data: allCrews
        };
    }

    // Helper method to check if user is authenticated
    isAuthenticated(): boolean {
        try {
            authService.getAuthHeaders();
            return true;
        } catch {
            return false;
        }
    }
}

export const apiService = new ApiService();
export default apiService;