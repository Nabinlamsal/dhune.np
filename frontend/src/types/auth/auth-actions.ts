export type MessageResponse = {
    message: string;
};

export type ForgotPasswordRequest = {
    email: string;
};

export type ResetPasswordRequest = {
    token: string;
    new_password: string;
};

export type ChangePasswordRequest = {
    old_password: string;
    new_password: string;
};

export type GoogleLoginRequest = {
    id_token: string;
};
