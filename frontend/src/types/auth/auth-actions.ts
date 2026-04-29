export type MessageResponse = {
    message: string;
    otp_expires_in_seconds?: number;
};

export type ForgotPasswordRequest = {
    email: string;
};

export type SendVerificationOTPRequest = {
    email: string;
};

export type VerifyEmailRequest = {
    email: string;
    otp: string;
};

export type ResetPasswordRequest = {
    email: string;
    otp: string;
    new_password: string;
};

export type ChangePasswordRequest = {
    old_password: string;
    new_password: string;
};

export type GoogleLoginRequest = {
    id_token: string;
};
