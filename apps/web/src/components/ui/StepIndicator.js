import { clsx } from 'clsx';

export function StepIndicator({ steps, currentStep }) {
    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                        {/* Step Circle */}
                        <div className="flex items-center">
                            <div
                                className={clsx(
                                    'flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium',
                                    {
                                        'bg-blue-600 border-blue-600 text-white': index < currentStep,
                                        'bg-blue-600 border-blue-600 text-white': index === currentStep,
                                        'bg-white border-gray-300 text-gray-500': index > currentStep,
                                    }
                                )}
                            >
                                {index < currentStep ? (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    index + 1
                                )}
                            </div>

                            {/* Step Label */}
                            <div className="ml-3">
                                <p className={clsx(
                                    'text-sm font-medium',
                                    {
                                        'text-blue-600': index <= currentStep,
                                        'text-gray-500': index > currentStep,
                                    }
                                )}>
                                    {step.title}
                                </p>
                                <p className="text-xs text-gray-500">{step.description}</p>
                            </div>
                        </div>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div className="flex-1 h-px mx-4">
                                <div
                                    className={clsx(
                                        'h-full',
                                        {
                                            'bg-blue-600': index < currentStep,
                                            'bg-gray-300': index >= currentStep,
                                        }
                                    )}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
} 