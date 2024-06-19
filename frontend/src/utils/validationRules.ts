export const requiredRule = (field: string) => (v: string) => !!v || `${field} is required`;

export const usernameRules = (required: boolean = true) => {
    const rules: ((v: string) => boolean | string)[] = [
        (v: string) => v.length <= 30 || 'Username must be less than 30 characters',
        (v: string) => /^[a-zA-Z0-9_]+$/.test(v) || 'Username may only contain letters, numbers, and underscores'
    ];
    if (required) {
        rules.unshift(requiredRule('Username'));
    }
    return rules;
};

export const firstnameRules = (required: boolean = true) => {
    const rules: ((v: string) => boolean | string)[] = [
        (v: string) => v.length <= 30 || 'First name must be less than 30 characters',
        (v: string) => /^[a-zA-Z]+$/.test(v) || 'First name may only contain letters'
    ];
    if (required) {
        rules.unshift(requiredRule('First name'));
    }
    return rules;
}

export const lastnameRules = (required: boolean = true) => {
    const rules: ((v: string) => boolean | string)[] = [
        (v: string) => v.length <= 30 || 'Last name must be less than 30 characters',
        (v: string) => /^[a-zA-Z]+$/.test(v) || 'Last name may only contain letters'
    ];
    if (required) {
        rules.unshift(requiredRule('Last name'));
    }
    return rules;
}


export const emailRules = (required: boolean = true) => {
    const rules: ((v: string) => boolean | string)[] = [
        (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid',
        (v: string) => v.length <= 254 || 'Email must be less than 254 characters'
    ];
    if (required) {
        rules.unshift(requiredRule('Email'));
    }
    return rules;
};

export const numberRules = (required: boolean = true) => {
    const rules: ((v: string) => boolean | string)[] = [
        (v: string) => v.length >= 10 || 'Phone number must be at least 10 characters long',
        (v: string) => v.length <= 15 || 'Phone number must be less than 15 characters',
        (v: string) => /^\+?[0-9]+$/.test(v) || 'Phone number may only contain numbers'
    ];
    if (required) {
        rules.unshift(requiredRule('Phone number'));
    }
    return rules;
}

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