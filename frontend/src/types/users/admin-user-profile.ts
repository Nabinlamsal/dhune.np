import { Role } from "../auth/identity";
import { BusinessProfile, VendorProfile } from "./profile";
import { UserDocument } from "./document";

//base user model
export interface AdminUserProfile {
    id: string;
    display_name: string;
    email: string;
    phone: string;
    role: Role;
    is_active: boolean;
    is_verified: boolean;
    created_at: string;

    business_profile?: BusinessProfile;
    vendor_profile?: VendorProfile;
    documents?: UserDocument[];
}
