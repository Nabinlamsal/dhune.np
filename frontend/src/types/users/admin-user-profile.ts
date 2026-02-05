import { Role } from "../auth/identity";
import { BusinessProfile, VendorProfile } from "./profile";
import { UserDocument } from "./document";

//base user model
export interface BaseUser {
    id: string; // uuid

    displayName: string;
    email: string;
    phone: string;

    role: Role;

    isActive: boolean;

    createdAt: string;
}


//admin view of users
export interface AdminUserProfile extends BaseUser {
    isVerified: boolean;

    businessProfile?: BusinessProfile;
    vendorProfile?: VendorProfile;

    documents?: UserDocument[];
}
