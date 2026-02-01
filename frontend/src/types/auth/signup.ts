import { UserStatus, Role } from "./identity";
export type SignupDocument = {
    document_type: string; // business_registration | vendor_registration
    document_url: string;
};

export type SignupRequest = {
    role: Role;
    display_name: string;
    email: string;
    phone: string;
    password: string;

    // optional 
    owner_name?: string;
    business_type?: string;
    address?: string;
    registration_number?: string;
    documents?: SignupDocument[];
};

export type SignupResponse = {
    user_id: string;
    role: Role;
    status: UserStatus;
    message: string;
};