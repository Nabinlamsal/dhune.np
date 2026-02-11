import { ApprovalStatus } from "./user.enums";


export interface BusinessProfile {
    owner_name: string;
    business_type: string;
    registration_number: string;
    approval_status: ApprovalStatus;
}

export interface VendorProfile {
    owner_name: string;
    address: string;
    registration_number: string;
    approval_status: ApprovalStatus;
}