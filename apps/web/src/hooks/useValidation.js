import { useState } from 'react';

export function useValidation(schema) {
    const [errors, setErrors] = useState({});

    const validate = (data) => {
        try {
            schema.parse(data);
            setErrors({});
            return true;
        } catch (error) {
            // Verificar si es un error de Zod (tiene estructura .errors)
            if (error.errors && Array.isArray(error.errors)) {
                const fieldErrors = {};
                error.errors.forEach(err => {
                    fieldErrors[err.path[0]] = err.message;
                });
                setErrors(fieldErrors);
            } else {
                // Si no es un error de Zod, mostrar error genérico
                console.error('Error de validación no esperado:', error);
                setErrors({ general: 'Los datos ingresados no son válidos. Revisa los campos.' });
            }
            return false;
        }
    };

    return { errors, validate, setErrors };
} 