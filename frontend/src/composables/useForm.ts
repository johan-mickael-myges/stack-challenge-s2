import { reactive, watch } from 'vue';
import { ZodSchema, ZodError } from 'zod';
import { ExpressError } from '@/types'; // Import the ExpressError type

interface FormField<T> {
    value: T;
    transform?: (value: T) => T; // Add transform function here
}

// an interface that has multiple objects of FormField
interface InitialData {
    [key: string]: FormField<any>;
}

interface FormState {
    data: InitialData;
    isSubmitting: boolean;
    validationErrors: { [key: string]: string[] };
    httpError: string | null;
    abortController?: AbortController;
}

export function useForm(initialData: InitialData, schema: ZodSchema<any>) {
    const formState = reactive<FormState>({
        data: initialData,
        isSubmitting: false,
        validationErrors: {},
        httpError: null,
    });

    // Apply transformations if defined
    const transformFlags = {} as { [key: string]: boolean };
    Object.keys(initialData).forEach((key) => {
        if (typeof initialData[key].transform === 'function') {
            transformFlags[key] = false; // Initialize transform flags
            watch(
                () => formState.data[key].value,
                (newValue) => {
                    if (!transformFlags[key]) {
                        transformFlags[key] = true;
                        formState.data[key].value = initialData[key].transform!(newValue);
                        transformFlags[key] = false;
                    }
                }
            );
        }
    });

    const transformField = (fieldName: string, transformFn: (value: any) => any) => {
        watch(() => formState.data[fieldName].value, (newValue) => {
            formState.data[fieldName].value = transformFn(newValue);
        });
    };

    const validate = () => {
        try {
            schema.parse(values());
            formState.validationErrors = {};
            return true;
        } catch (e) {
            if (e instanceof ZodError) {
                formState.validationErrors = e.errors.reduce((acc, error) => {
                    const field = error.path[0] as string;
                    if (!acc[field]) {
                        acc[field] = [];
                    }
                    acc[field].push(error.message);
                    return acc;
                }, {} as { [key: string]: string[] });
            }
            return false;
        }
    };

    const submitForm = async (submitFn: (data: any, signal: AbortSignal) => Promise<any>) => {
        if (!validate()) {
            return;
        }

        formState.isSubmitting = true;
        formState.httpError = null;
        formState.abortController = new AbortController();

        try {
            await submitFn(values(), formState.abortController.signal);
            formState.isSubmitting = false;
        } catch (error: any) {
            formState.isSubmitting = false;
            if (error.name === 'CanceledError') {
                return;
            } else if (error.response) {
                if (Array.isArray(error.response.data)) {
                    mapExpressErrorsToValidationErrors(error.response.data);
                } else {
                    formState.httpError = error.response.data || 'An error occurred';
                }
            } else {
                formState.httpError = 'An error occurred';
            }
        }
    };

    const cancelRequest = () => {
        if (formState.abortController) {
            formState.abortController.abort();
        }
    };

    const values = () => {
        return Object.keys(formState.data).reduce((acc, key) => {
            acc[key] = formState.data[key].value;
            return acc;
        }, {} as { [key: string]: any });
    };

    const initData = (data, initialData) => {
        Object.keys(data).forEach((key) => {
            formState.data[key] = {
                value: data[key],
                transform: initialData[key]?.transform || undefined,
            };
        });
    };

    const mapExpressErrorsToValidationErrors = (errors: ExpressError[]) => {
        errors.forEach((error: ExpressError) => {
            if (!formState.validationErrors[error.path]) {
                formState.validationErrors[error.path] = [];
            }
            formState.validationErrors[error.path].push(error.msg);
        });
    };

    return {
        formState,
        transformField,
        submitForm,
        cancelRequest,
        values,
        initData,
    };
}
