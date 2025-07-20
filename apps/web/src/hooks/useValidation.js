import { useState } from 'react';

export function useValidation(schema) {
    const [errors, setErrors] = useState({});

    const validate = (data) => {
        try {
            schema.parse(data);
            setErrors({});
            return true;
        } catch (error) {
            const fieldErrors = {};
            error.errors.forEach(err => {
                fieldErrors[err.path[0]] = err.message;
            });
            setErrors(fieldErrors);
            return false;
        }
    };

    return { errors, validate, setErrors };
} 