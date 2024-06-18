export const requiredRule = (field: string) => (v: string) => !!v || `${field} is required`;

export const emailRules = (required: boolean = true) => {
    const rules = [
        (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid',
        (v: string) => v.length <= 254 || 'Email must be less than 254 characters'
    ];
    if (required) {
        rules.unshift(requiredRule('Email'));
    }
    return rules;
};

export const passwordRules = (options: {
    required?: boolean,
    minLength?: number,
    uppercase?: boolean,
    lowercase?: boolean,
    digit?: boolean,
    specialChar?: boolean
} = {}) => {
    const {
        required = true,
        minLength = 1,
        uppercase = false,
        lowercase = false,
        digit = false,
        specialChar = false
    } = options;

    const rules = [
        (v: string) => v.length >= minLength || `Password must be at least ${minLength} characters long`,
    ];

    if (uppercase) {
        rules.push((v: string) => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter');
    }
    if (lowercase) {
        rules.push((v: string) => /[a-z]/.test(v) || 'Password must contain at least one lowercase letter');
    }
    if (digit) {
        rules.push((v: string) => /[0-9]/.test(v) || 'Password must contain at least one digit');
    }
    if (specialChar) {
        rules.push((v: string) => /[^A-Za-z0-9]/.test(v) || 'Password must contain at least one special character');
    }

    if (required) {
        rules.unshift(requiredRule('Password'));
    }

    return rules;
};

export function passwordMatchRule(target: string) {
    return [
        (v: string) => v === target || 'Passwords do not match',
    ];
}