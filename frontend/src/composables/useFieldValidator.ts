import {ref} from 'vue';
import {ZodError} from "zod";

export function useFieldValidator(fieldSchema) {
    const value = ref(null);
    const valid = ref(false);
    const errors = ref<ZodError>(null);

    const setValue = (newValue: any) => {
        value.value = newValue;
    }

    const validate = () => {
        try {
            fieldSchema.parse(value.value)
            valid.value = true;
        } catch(error){
            valid.value = false;
            errors.value = error.errors;
        }
    }

    const isValid = () => {
        return valid.value;
    }

    const getErrors = () => {
        if (!errors.value || !Array.isArray(errors.value)) {
            return [];
        }
        return errors.value.map((error: any) => {
            return error.message;
        });
    }

    return {
        setValue,
        validate,
        isValid,
        getErrors,
    };
}
