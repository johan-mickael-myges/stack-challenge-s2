import { reactive, watch } from 'vue';
import { ZodSchema, ZodError } from 'zod';

interface Rule<T> {
    (value: T): boolean | string;
}

interface FormField<T> {
    value: T;
    rules?: Rule<T>[];
}

// an interface that have multiple object of FormField
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

    const transformField = (fieldName: string, transformFn: (value: any) => any) => {
        watch(() => formState.data[fieldName], (newValue) => {
            formState.data[fieldName] = transformFn(newValue);
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
                formState.httpError = error.response.data || 'An error occurred';
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

    const rules = () => {
        return Object.keys(formState.data).reduce((acc, key) => {
            acc[key] = formState.data[key].rules;
            return acc;
        }, {} as { [key: string]: Rule<any>[] });
    };

    const initData = (data, rules) => {
        Object.keys(data).forEach((key) => {
            formState.data[key] = {
                value: data[key],
                rules: rules[key],
            };
        });
    }

    return {
        formState,
        transformField,
        submitForm,
        cancelRequest,
        values,
        rules,
        initData,
    };
}