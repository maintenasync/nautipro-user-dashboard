// app/hooks/useApiQuery.ts
import { useQuery } from '@tanstack/react-query';
import apiService from '@/app/services/apiService';
import type { Company, Vessel, CrewMember, CompanyUI, VesselUI, CrewMemberUI } from '@/app/types/api';

// Helper functions to transform data for UI
const transformCompanyForUI = (company: Company): CompanyUI => ({
    id: company.id,
    name: company.name,
    location: `${company.city}, ${company.province}`,
    created: new Date(parseInt(company.created_at)).toLocaleDateString('id-ID'),
});

const transformVesselForUI = (vessel: Vessel, companyName?: string): VesselUI => ({
    id: vessel.id,
    name: vessel.name.trim(),
    type: vessel.vessel_type.name,
    company: companyName || 'Unknown Company',
    status: vessel.is_deleted ? 'Inactive' : 'Active', // You might need better status logic
    imo: vessel.imo,
    image: vessel.image,
});

const transformCrewForUI = (crew: CrewMember, vesselName?: string): CrewMemberUI => ({
    id: crew.id,
    name: crew.user.name,
    email: crew.user.email,
    role: crew.user_role.name,
    vessel: vesselName || 'Unknown Vessel',
    vessel_id: crew.vessel_id,
    startDate: crew.start_at ? new Date(parseInt(crew.start_at)).toLocaleDateString('id-ID') : 'N/A',
    status: crew.user.user_status ? 'Active' : 'Inactive',
    avatar: crew.user.avatar,
});

// Companies Hooks
export const useCompanies = () => {
    return useQuery({
        queryKey: ['companies'],
        queryFn: async () => {
            const response = await apiService.getCompanies();
            return response.data.map(transformCompanyForUI);
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useCompany = (companyId: string) => {
    return useQuery({
        queryKey: ['company', companyId],
        queryFn: async () => {
            const response = await apiService.getCompany(companyId);
            return transformCompanyForUI(response.data);
        },
        enabled: !!companyId,
        staleTime: 5 * 60 * 1000,
    });
};

// Vessels Hooks
export const useVesselsByCompany = (companyId: string) => {
    const { data: companies } = useCompanies();

    return useQuery({
        queryKey: ['vessels', 'company', companyId],
        queryFn: async () => {
            const response = await apiService.getVesselsByCompany(companyId);
            const company = companies?.find(c => c.id === companyId);
            return response.data.map(vessel => transformVesselForUI(vessel, company?.name));
        },
        enabled: !!companyId,
        staleTime: 3 * 60 * 1000, // 3 minutes
    });
};

// Get all vessels across all companies (for vessels page)
export const useAllVessels = () => {
    const { data: companies } = useCompanies();

    return useQuery({
        queryKey: ['vessels', 'all'],
        queryFn: async () => {
            if (!companies) return [];

            const allVessels: VesselUI[] = [];

            for (const company of companies) {
                try {
                    const response = await apiService.getVesselsByCompany(company.id);
                    const transformedVessels = response.data.map(vessel =>
                        transformVesselForUI(vessel, company.name)
                    );
                    allVessels.push(...transformedVessels);
                } catch (error) {
                    console.warn(`Failed to fetch vessels for company ${company.id}:`, error);
                }
            }

            return allVessels;
        },
        enabled: !!companies && companies.length > 0,
        staleTime: 3 * 60 * 1000,
    });
};

// Crews Hooks
export const useCrewsByVessel = (vesselId: string) => {
    const { data: vessels } = useAllVessels();

    return useQuery({
        queryKey: ['crews', 'vessel', vesselId],
        queryFn: async () => {
            const response = await apiService.getCrewsByVessel(vesselId);
            const vessel = vessels?.find(v => v.id === vesselId);
            return response.data.map(crew => transformCrewForUI(crew, vessel?.name));
        },
        enabled: !!vesselId,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

export const useCrewsByCompany = (companyId: string) => {
    const { data: vessels } = useAllVessels();

    return useQuery({
        queryKey: ['crews', 'company', companyId],
        queryFn: async () => {
            const response = await apiService.getCrewsByCompany(companyId);
            return response.data.map(crew => {
                const vessel = vessels?.find(v => v.id === crew.vessel_id);
                return transformCrewForUI(crew, vessel?.name);
            });
        },
        enabled: !!companyId,
        staleTime: 2 * 60 * 1000,
    });
};

// Get all crews across all companies (for crew management page)
export const useAllCrews = () => {
    const { data: companies } = useCompanies();
    const { data: vessels } = useAllVessels();

    return useQuery({
        queryKey: ['crews', 'all'],
        queryFn: async () => {
            if (!companies) return [];

            const allCrews: CrewMemberUI[] = [];

            for (const company of companies) {
                try {
                    const response = await apiService.getCrewsByCompany(company.id);
                    const transformedCrews = response.data.map(crew => {
                        const vessel = vessels?.find(v => v.id === crew.vessel_id);
                        return transformCrewForUI(crew, vessel?.name);
                    });
                    allCrews.push(...transformedCrews);
                } catch (error) {
                    console.warn(`Failed to fetch crews for company ${company.id}:`, error);
                }
            }

            return allCrews;
        },
        enabled: !!companies && companies.length > 0 && !!vessels,
        staleTime: 2 * 60 * 1000,
    });
};

// Filtering hooks for crew management
export const useFilteredCrews = (filters: {
    vessel?: string;
    role?: string;
    status?: string;
    search?: string;
}) => {
    const { data: crews, ...query } = useAllCrews();

    const filteredCrews = crews?.filter(crew => {
        const matchesVessel = !filters.vessel || filters.vessel === 'All Vessels' || crew.vessel === filters.vessel;
        const matchesRole = !filters.role || filters.role === 'All Roles' || crew.role === filters.role;
        const matchesStatus = !filters.status || filters.status === 'All Status' || crew.status === filters.status;
        const matchesSearch = !filters.search ||
            crew.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            crew.email.toLowerCase().includes(filters.search.toLowerCase());

        return matchesVessel && matchesRole && matchesStatus && matchesSearch;
    }) || [];

    return {
        ...query,
        data: filteredCrews,
    };
};

// Authentication check hook
export const useAuthCheck = () => {
    return useQuery({
        queryKey: ['auth', 'check'],
        queryFn: () => apiService.isAuthenticated(),
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
};