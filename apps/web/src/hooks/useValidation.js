import { useState } from 'react';

export function useValidation(schema) {
    const [errors, setErrors] = useState({});

    const validate = (data) => {
        try {
            schema.parse(data);
            setErrors({});
            return true;
        } catch (error) {
            if (error.issues && Array.isArray(error.issues)) {
                const fieldErrors = {};
                error.issues.forEach(err => {
                    fieldErrors[err.path[0]] = err.message;
                });
                setErrors(fieldErrors);
            } else {
                console.error('Error de validación no esperado:', error);
                setErrors({ general: 'Los datos ingresados no son válidos. Revisa los campos.' });
            }
            return false;
        }
    };

    return { errors, validate, setErrors };
} 