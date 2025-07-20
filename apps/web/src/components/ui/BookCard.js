import { StarRating } from './StarRating';
import { Button } from './Button';
import { clsx } from 'clsx';

// Componente de icono por defecto para libros
const DefaultBookIcon = ({ className = "w-full h-full" }) => (
    <div className={clsx("flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200", className)}>
        <svg
            className="w-16 h-16 text-blue-600"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z" />
            <path d="M8 12h8v1H8v-1zm0 2h8v1H8v-1zm0 2h5v1H8v-1z" />
        </svg>
    </div>
);

export function BookCard({
    book,
    onSelect,
    onRatingChange,
    onStatusChange,
    isSelected = false,
    showRating = false,
    showStatus = false,
    showActions = true,
    rating = 0,
    status = 'TO_READ',
    variant = 'default' // 'default', 'compact', 'detailed'
}) {
    const handleSelect = () => {
        if (onSelect) {
            onSelect(book);
        }
    };

    const statusOptions = [
        { value: 'TO_READ', label: 'Por leer', color: 'bg-blue-100 text-blue-800' },
        { value: 'READ', label: 'Leído', color: 'bg-green-100 text-green-800' },
        { value: 'ABANDONED', label: 'Abandonado', color: 'bg-red-100 text-red-800' }
    ];

    const currentStatus = statusOptions.find(s => s.value === status);

    if (variant === 'compact') {
        return (
            <div className={clsx(
                'flex items-center p-3 border rounded-lg transition-all duration-200 hover:shadow-md',
                {
                    'border-blue-500 bg-blue-50': isSelected,
                    'border-gray-200 bg-white': !isSelected
                }
            )}>
                <div className="w-12 h-16 rounded flex-shrink-0 overflow-hidden">
                    {book.coverUrl ? (
                        <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                            }}
                        />
                    ) : null}
                    <DefaultBookIcon className={book.coverUrl ? "hidden" : "w-full h-full rounded"} />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                        {book.title}
                    </h4>
                    <p className="text-xs text-gray-600 truncate">
                        {book.authors?.map(author => author.name).join(', ') || 'Autor desconocido'}
                    </p>
                    {showRating && (
                        <div className="mt-1">
                            <StarRating
                                rating={rating}
                                onChange={onRatingChange}
                                size="sm"
                                showValue={false}
                            />
                        </div>
                    )}
                </div>
                {showActions && (
                    <Button
                        size="sm"
                        variant={isSelected ? "default" : "outline"}
                        onClick={handleSelect}
                    >
                        {isSelected ? 'Seleccionado' : 'Seleccionar'}
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className={clsx(
            'bg-white border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg',
            {
                'border-blue-500 ring-2 ring-blue-200': isSelected,
                'border-gray-200': !isSelected
            }
        )}>
            <div className="aspect-w-3 aspect-h-4 bg-gray-100 h-48 relative overflow-hidden">
                {book.coverUrl ? (
                    <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <DefaultBookIcon className={book.coverUrl ? "hidden absolute inset-0" : "w-full h-full"} />
            </div>

            <div className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                            {book.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            {book.authors?.map(author => author.name).join(', ') || 'Autor desconocido'}
                        </p>
                    </div>

                    {showStatus && currentStatus && (
                        <span className={clsx(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2',
                            currentStatus.color
                        )}>
                            {currentStatus.label}
                        </span>
                    )}
                </div>

                {book.synopsis && variant === 'detailed' && (
                    <p className="text-sm text-gray-700 mt-3 line-clamp-3">
                        {book.synopsis}
                    </p>
                )}

                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    {book.pages && (
                        <span>{book.pages} páginas</span>
                    )}
                    {book.publishedYear && (
                        <span>{book.publishedYear}</span>
                    )}
                </div>

                {showRating && (
                    <div className="mt-3">
                        <StarRating
                            rating={rating}
                            onChange={onRatingChange}
                            size="sm"
                        />
                    </div>
                )}

                {showStatus && onStatusChange && (
                    <div className="mt-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Estado
                        </label>
                        <select
                            value={status}
                            onChange={(e) => onStatusChange(e.target.value)}
                            className="w-full text-xs border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {showActions && (
                    <div className="mt-4">
                        <Button
                            className="w-full"
                            variant={isSelected ? "default" : "outline"}
                            onClick={handleSelect}
                        >
                            {isSelected ? 'Seleccionado' : 'Seleccionar'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
} 