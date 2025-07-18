// app/types/api.ts

// Base API Response Structure
export interface ApiResponse<T> {
    code: number;
    status: string;
    data: T;
}

// Company Interfaces
export interface Company {
    id: string;
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
    created_at: string;
    updated_at: string;
    logo?: string;
}

// Vessel Interfaces
export interface VesselType {
    id: number;
    name: string;
}

export interface VesselClass {
    id: number;
    name: string;
    country: string;
    is_iacs: boolean;
    created_at: string;
    updated_at: string;
}

export interface Vessel {
    id: string;
    name: string;
    previous_name: string;
    imo: string;
    mmsi: string;
    flag: string;
    callsign: string;
    gross_tonnage: number;
    summer_deadweight: number;
    year_of_build: number;
    place_of_build: string;
    vesseltype_id: number;
    class_id: number;
    company_id: string;
    is_deleted: boolean;
    image: string;
    created_at: string;
    updated_at: string;
    vessel_type: VesselType;
    class: VesselClass;
}

// Crew/User Interfaces
export interface UserRole {
    id: number;
    role_code: string;
    name: string;
    description: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    email_verification: boolean;
    name: string;
    password: string;
    user_status: boolean;
    avatar: string;
    role: string;
    created_at: string;
    updated_at: string;
}

export interface CrewMember {
    id: number;
    company_id: string;
    vessel_id: string;
    user_id: string;
    user_role_id: number;
    start_at: string;
    end_at: string;
    created_at: string;
    updated_at: string;
    company: Company;
    user: User;
    user_role: UserRole;
}

// For UI Components (transformed data)
export interface CompanyUI {
    id: string;
    name: string;
    location: string;
    vessels?: number;
    crews?: number;
    created: string;
}

export interface VesselUI {
    id: string;
    name: string;
    type: string;
    company: string;
    status: string;
    imo: string;
    image?: string;
}

export interface CrewMemberUI {
    id: number;
    name: string;
    email: string;
    role: string;
    vessel: string;
    vessel_id: string;
    startDate: string;
    status: string;
    avatar?: string;
}