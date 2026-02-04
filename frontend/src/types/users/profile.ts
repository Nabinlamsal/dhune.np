import { ApprovalStatus } from "./user.enums";


//shared profile fields
export interface BaseProfile {
    ownerName: string;
    registrationNumber: string;
    approvalStatus: ApprovalStatus;
}


//business profile only field
export interface BusinessProfile extends BaseProfile {
    businessType: string;
}


//vendor profile only field
export interface VendorProfile extends BaseProfile {
    address: string;
}
