export const BaseValidation: Record<string, RegExp> = {
    alphaNumeric: /^[a-zA-Z0-9]*$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
    alphabatic: /^[A-Za-z]+$/,
    nameAlphabatic: /^[A-Za-z ]+$/,
    numeric: /^[0-9]+$/,
    username: /^[A-Za-z0-9 ]{2,20}$/,
    phone: /^[6-9]\d{9}$/,
} as const;


type TRule<T> = {
    value: T;
    message: string;
};


type TFieldValidationRules = {
    pattern?: TRule<RegExp>;
    maxLength?: TRule<number>;
    minLength?: TRule<number>;
    validate?: (value: string) => boolean | string;
};

type TErrorTypes = {
    required: (fieldName?: string) => { required: string };
    email: TFieldValidationRules;
    phone: TFieldValidationRules;
    password: TFieldValidationRules;
    name: TFieldValidationRules;

};

export const errorTypes: TErrorTypes = {
    required: (fieldName = 'This field') => ({
        required: `${fieldName} is required`,
    }),

    email: {
        pattern: {
            value: BaseValidation.email,
            message: 'Invalid email address',
        },
        maxLength: {
            value: 254,
            message: 'Email cannot exceed 254 characters',
        },
        validate: (value) => {
            if (value !== value?.trim())
                return 'Email cannot have leading or trailing spaces';
            if (value !== value.toLowerCase()) return 'Email must be in lowercase';
            return true;
        },
    },

    phone: {
        pattern: {
            value: BaseValidation.phone,
            message: 'Please enter a valid 10-digit mobile number',
        },
        maxLength: {
            value: 10,
            message: 'Mobile number cannot be more than 10 digits',
        },
        minLength: {
            value: 10,
            message: 'Mobile number must be exactly 10 digits',
        },
    },
    password: {
        minLength: {
            value: 6,
            message: 'Password must be at least 6 characters long',
        },
        pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
            message:
                'Password must include uppercase, lowercase, number, and special character',
        },
    },
    name: {
        pattern: {
            value: /^[a-zA-Z\s]*$/,
            message: 'Name must contain only letters and spaces',
        },
        maxLength: {
            value: 160,
            message: 'Name should not exceed 160 characters',
        },
    },
};
