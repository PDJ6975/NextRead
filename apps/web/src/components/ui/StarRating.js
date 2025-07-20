import { useState } from 'react';
import { clsx } from 'clsx';

export function StarRating({
    rating = 0,
    onChange,
    maxRating = 5,
    size = 'md',
    readOnly = false,
    showValue = true
}) {
    const [hoverRating, setHoverRating] = useState(0);

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    const handleStarClick = (value) => {
        if (!readOnly && onChange) {
            onChange(value);
        }
    };

    const handleStarHover = (value) => {
        if (!readOnly) {
            setHoverRating(value);
        }
    };

    const handleMouseLeave = () => {
        if (!readOnly) {
            setHoverRating(0);
        }
    };

    const getStarValue = (index) => {
        const starValue = index + 0.5; // Para media estrella
        const currentRating = hoverRating || rating;

        if (currentRating >= index + 1) {
            return 'full';
        } else if (currentRating >= starValue) {
            return 'half';
        } else {
            return 'empty';
        }
    };

    return (
        <div className="flex items-center space-x-1">
            <div
                className="flex items-center space-x-0.5"
                onMouseLeave={handleMouseLeave}
            >
                {Array.from({ length: maxRating }, (_, index) => {
                    const starValue = getStarValue(index);

                    return (
                        <button
                            key={index}
                            type="button"
                            disabled={readOnly}
                            className={clsx(
                                'relative transition-colors duration-150',
                                {
                                    'cursor-pointer hover:scale-110': !readOnly,
                                    'cursor-default': readOnly,
                                }
                            )}
                            onClick={() => handleStarClick(index + 1)}
                            onMouseEnter={() => handleStarHover(index + 1)}
                        >
                            {/* Base star (empty) */}
                            <svg
                                className={clsx(sizeClasses[size], 'text-gray-300')}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>

                            {/* Filled star overlay */}
                            {starValue !== 'empty' && (
                                <svg
                                    className={clsx(
                                        sizeClasses[size],
                                        'absolute inset-0 text-yellow-400',
                                        {
                                            'w-1/2 overflow-hidden': starValue === 'half'
                                        }
                                    )}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            )}
                        </button>
                    );
                })}
            </div>

            {showValue && (
                <span className="text-sm text-gray-600 ml-2">
                    {rating > 0 ? `${rating}/5` : 'Sin valorar'}
                </span>
            )}
        </div>
    );
} 