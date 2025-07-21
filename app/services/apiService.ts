// app/services/apiService.ts
import authService from './authService';
import type {
    ApiResponse,
    Company,
    Vessel,
    CrewMember,
    License,
    Invitation,
    VesselType,
    UserRole
} from '@/app/types/api';

const BASE_URL = 'https://auth.nautiproconnect.com/api/v1/web';

class ApiService {
    private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
        try {
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
            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    private async requestWithFormData<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
        try {
            const authHeaders = authService.getAuthHeaders();
            // Remove Content-Type for FormData - let browser set it with boundary
            const { 'Content-Type': _, ...headers } = authHeaders;

            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'POST',
                headers,
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data: ApiResponse<T> = await response.json();
            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // ========== CREW MANAGEMENT API ==========

    async getRoles(): Promise<ApiResponse<UserRole[]>> {
        return this.request<UserRole[]>('/get-roles-vessel-member-maintena');
    }

    async updateVesselMember(data: {
        vessel_id: string;
        user_role_code: string;
        user_id: string;
        company_id: string;
    }): Promise<ApiResponse<any>> {
        return this.request<any>('/update-vessel-member-maintena', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }

    async removeVesselMember(data: {
        vessel_id: string;
        user_role_code: string;
        user_id: string;
        company_id: string;
    }): Promise<ApiResponse<any>> {
        return this.request<any>('/update-vessel-member-maintena', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }

    // ========== COMPANIES CRUD API ==========

    async getVesselTypes(): Promise<ApiResponse<VesselType[]>> {
        return this.request<VesselType[]>('/vessel-types');
    }

    async createCompany(data: {
        name: string;
        registration_number: string;
        address: string;
        city: string;
        province: string;
        postal_code: string;
        country: string;
        phone: string;
        email: string;
        website: string;
    }): Promise<ApiResponse<Company>> {
        return this.request<Company>('/create-company', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }

    async updateCompanyLogo(companyId: string, logoFile: File): Promise<ApiResponse<any>> {
        const formData = new FormData();
        formData.append('logo', logoFile);

        return this.requestWithFormData<any>(`/update-company-logo/${companyId}`, formData);
    }

    async updateCompany(companyId: string, data: {
        name: string;
        registration_number: string;
        address: string;
        city: string;
        province: string;
        postal_code: string;
        country: string;
        phone: string;
        email: string;
        website: string;
    }): Promise<ApiResponse<Company>> {
        return this.request<Company>(`/update-company/${companyId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }

    async deleteCompany(companyId: string): Promise<ApiResponse<any>> {
        return this.request<any>(`/delete-company/${companyId}`, {
            method: 'DELETE',
        });
    }

    // ========== VESSEL CRUD API ==========

    async createVessel(data: {
        name: string;
        previous_name?: string;
        imo: string;
        mmsi: string;
        flag: string;
        callsign: string;
        gross_tonnage: number;
        summer_deadweight: number;
        year_of_build: number;
        place_of_build: string;
        vesseltype_id: number;
        class_name: string;
        company_id: string;
    }): Promise<ApiResponse<Vessel>> {
        return this.request<Vessel>('/create-vessel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }

    async updateVesselImage(vesselId: string, imageFile: File): Promise<ApiResponse<any>> {
        const formData = new FormData();
        formData.append('image', imageFile);

        return this.requestWithFormData<any>(`/update-image-vessel/${vesselId}`, formData);
    }

    async updateVessel(data: {
        id: string;
        name: string;
        previous_name?: string;
        imo: string;
        mmsi: string;
        flag: string;
        callsign: string;
        gross_tonnage: number;
        summer_deadweight: number;
        year_of_build: number;
        place_of_build: string;
        vesseltype_id: number;
        class_name: string;
        company_id: string;
    }): Promise<ApiResponse<Vessel>> {
        return this.request<Vessel>('/update-vessel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }

    async deleteVessel(vesselId: string): Promise<ApiResponse<any>> {
        return this.request<any>(`/delete-vessel/${vesselId}`, {
            method: 'DELETE',
        });
    }

    // ========== EXISTING METHODS (Keep existing functionality) ==========

    async getCompanies(): Promise<ApiResponse<Company[]>> {
        return this.request<Company[]>('/companies');
    }

    async getCompany(id: string): Promise<ApiResponse<Company>> {
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

    async getVesselsByCompany(companyId: string): Promise<ApiResponse<Vessel[]>> {
        return this.request<Vessel[]>(`/get-vessels-by-company/${companyId}`);
    }

    async getCrewsByVessel(vesselId: string): Promise<ApiResponse<CrewMember[]>> {
        return this.request<CrewMember[]>(`/get-vessel-member-maintena-by-vessel/${vesselId}`);
    }

    async getCrewsByCompany(companyId: string): Promise<ApiResponse<CrewMember[]>> {
        return this.request<CrewMember[]>(`/get-vessels-member-maintena-by-company/${companyId}`);
    }

    async getLicenses(): Promise<ApiResponse<License[]>> {
        return this.request<License[]>('/get-license-maintena');
    }

    async getInvitations(): Promise<ApiResponse<Invitation[]>> {
        return this.request<Invitation[]>('/get-invitations-vessel-member-maintena');
    }

    async acceptInvitation(invitationId: number): Promise<ApiResponse<any>> {
        return this.request<any>(`/accept-invitation-vessel-member-maintena/${invitationId}`);
    }

    async rejectInvitation(invitationId: number): Promise<ApiResponse<any>> {
        return this.request<any>(`/reject-invitation-vessel-member-maintena/${invitationId}`);
    }

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