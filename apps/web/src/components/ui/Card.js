import { clsx } from 'clsx';

export function Card({ children, className = '', ...props }) {
    return (
        <div
            className={clsx(
                'bg-white rounded-lg border border-gray-200 shadow-sm',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '' }) {
    return (
        <div className={clsx('px-6 py-4 border-b border-gray-200', className)}>
            {children}
        </div>
    );
}

export function CardContent({ children, className = '' }) {
    return (
        <div className={clsx('px-6 py-4', className)}>
            {children}
        </div>
    );
} 