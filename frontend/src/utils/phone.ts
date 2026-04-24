export const sanitizePhoneInput = (value: string) => value.replace(/\D/g, "").slice(0, 10);

export const isValidPhone = (value: string) => /^\d{10}$/.test(value);
