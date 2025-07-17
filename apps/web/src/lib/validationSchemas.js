import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z.object({
    fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
});

export const verifySchema = z.object({
    email: z.string().email('Email inválido'),
    verificationCode: z.string().min(6, 'El código debe tener 6 caracteres').max(6, 'El código debe tener 6 caracteres'),
});

export const surveySchema = z.object({
    pace: z.enum(['SLOW', 'MEDIUM', 'FAST'], 'Selecciona un ritmo de lectura'),
    genres: z.array(z.string()).min(1, 'Selecciona al menos un género'),
    readBooks: z.array(z.object({
        id: z.number(),
        rating: z.number().min(0.5).max(5),
    })).min(3, 'Añade al menos 3 libros leídos'),
}); 