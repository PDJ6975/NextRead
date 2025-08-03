'use client';

import { useState } from 'react';
import { CheckCircle, Edit3, ArrowRight, Sparkles } from 'lucide-react';
import { ButtonCozy } from '../ui/cozy/ButtonCozy';
import { CardCozy } from '../ui/cozy/CardCozy';
import { BookCozyIcon, StarCozyIcon, HeartCozyIcon, MagicCozyIcon, ClockCozyIcon } from '../ui/cozy/IconCozy';

// Configuración de géneros para mostrar etiquetas bonitas
const genreLabels = {
    'ROMANCE': 'Romance',
    'FANTASY': 'Fantasía',
    'SCIENCE_FICTION': 'Ciencia Ficción',
    'MYSTERY': 'Misterio',
    'THRILLER': 'Thriller',
    'CONTEMPORARY_FICTION': 'Ficción Contemporánea',
    'LITERARY_FICTION': 'Ficción Literaria',
    'HISTORICAL_FICTION': 'Ficción Histórica',
    'NON_FICTION': 'No Ficción',
    'BIOGRAPHY': 'Biografía',
    'SELF_HELP': 'Autoayuda',
    'YOUNG_ADULT': 'Juvenil',
    'HORROR': 'Horror',
    'ADVENTURE': 'Aventura'
};

// Configuración de ritmos de lectura
const paceLabels = {
    'SLOW': { label: 'Libros Reflexivos', emoji: '📚', description: 'Te gustan los libros profundos' },
    'FAST': { label: 'Libros Dinámicos', emoji: '⚡', description: 'Prefieres la acción constante' }
};

// Componente de resumen de preferencias
const PreferencesSummary = ({ pace, genres }) => {
    const paceInfo = paceLabels[pace];
    
    return (
        <CardCozy variant="soft" className="p-6">
            <div className="flex items-center gap-3 mb-4">
                <HeartCozyIcon className="w-6 h-6 text-cozy-sage" />
                <h3 className="text-lg font-semibold font-cozy-display text-cozy-warm-brown">
                    Tus Preferencias
                </h3>
            </div>
            
            {/* Ritmo de lectura */}
            <div className="mb-4">
                <h4 className="text-sm font-medium text-cozy-warm-brown mb-2">Ritmo de lectura:</h4>
                <div className="bg-cozy-sage/10 border border-cozy-sage/30 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{paceInfo?.emoji}</span>
                        <div>
                            <p className="font-medium text-cozy-warm-brown">{paceInfo?.label}</p>
                            <p className="text-sm text-cozy-medium-gray">{paceInfo?.description}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Géneros favoritos */}
            <div>
                <h4 className="text-sm font-medium text-cozy-warm-brown mb-2">
                    Géneros favoritos ({genres.length}):
                </h4>
                <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                        <span
                            key={genre}
                            className="px-3 py-1 bg-cozy-terracotta/10 border border-cozy-terracotta/30 text-cozy-warm-brown rounded-full text-sm font-cozy"
                        >
                            {genreLabels[genre] || genre}
                        </span>
                    ))}
                </div>
            </div>
        </CardCozy>
    );
};

// Componente de resumen de libros
const BooksSummary = ({ books, title, icon: IconComponent, emptyMessage, color = 'cozy-sage' }) => {
    return (
        <CardCozy variant="soft" className="p-6">
            <div className="flex items-center gap-3 mb-4">
                <IconComponent className={`w-6 h-6 text-${color}`} />
                <h3 className="text-lg font-semibold font-cozy-display text-cozy-warm-brown">
                    {title} ({books.length})
                </h3>
            </div>
            
            {books.length > 0 ? (
                <div className="space-y-3 max-h-48 overflow-y-auto">
                    {books.map((book, index) => (
                        <div key={book.id || index} className="flex gap-3 p-3 bg-white/50 rounded-lg border border-cozy-light-gray">
                            {/* Mini portada */}
                            <div className={`flex-shrink-0 w-10 h-12 rounded-md cozy-shadow-sm relative overflow-hidden`}>
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
                                <div className={`${book.coverUrl ? 'hidden' : 'flex'} absolute inset-0 bg-gradient-to-b from-${color} to-cozy-warm-brown items-center justify-center`}>
                                    <BookCozyIcon className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            
                            {/* Información del libro */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-cozy-warm-brown text-sm truncate">
                                    {book.title}
                                </h4>
                                <p className="text-xs text-cozy-medium-gray truncate">
                                    {book.authors?.map(author => author.name).join(', ') || book.author || 'Autor desconocido'}
                                </p>
                                
                                {/* Rating para libros leídos */}
                                {book.rating && book.rating > 0 && (
                                    <div className="flex items-center gap-1 mt-1">
                                        {[...Array(5)].map((_, i) => (
                                            <StarCozyIcon
                                                key={i}
                                                className={`w-3 h-3 ${
                                                    i < book.rating
                                                        ? 'text-cozy-soft-yellow fill-current'
                                                        : 'text-cozy-light-gray'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}
                                
                                {/* Razón para libros abandonados */}
                                {book.reason && (
                                    <span className="text-xs bg-cozy-soft-yellow/20 text-cozy-warm-brown px-2 py-0.5 rounded-full mt-1 inline-block">
                                        {book.reason}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-cozy-medium-gray">
                    <p className="font-cozy">{emptyMessage}</p>
                </div>
            )}
        </CardCozy>
    );
};

export function SurveyConfirmationCozy({ data, onComplete, onPrev, isSubmitting, isFirstTime }) {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleComplete = () => {
        setIsAnimating(true);
        setTimeout(() => {
            onComplete();
        }, 500);
    };

    const { pace, genres, readBooks, abandonedBooks } = data;
    const totalBooks = readBooks.length + abandonedBooks.length;

    return (
        <div className={`max-w-4xl mx-auto transition-all duration-500 ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
            {/* Header de confirmación */}
            <CardCozy variant="magical" className="mb-8 p-8 text-center relative overflow-hidden">
                {/* Elementos decorativos de fondo */}
                <div className="absolute top-4 left-4 opacity-20">
                    <MagicCozyIcon className="w-6 h-6 text-cozy-sage animate-pulse" />
                </div>
                <div className="absolute bottom-4 right-4 opacity-20">
                    <StarCozyIcon className="w-8 h-8 text-cozy-terracotta animate-pulse" style={{animationDelay: '1s'}} />
                </div>
                
                <div className="relative">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="relative">
                            <CheckCircle className="w-12 h-12 text-cozy-sage" />
                            <div className="absolute inset-0 w-12 h-12 border-4 border-cozy-sage rounded-full animate-ping opacity-20" />
                        </div>
                    </div>
                    
                    <h2 className="text-3xl font-bold font-cozy-display text-cozy-warm-brown mb-4">
                        {isFirstTime ? '¡Perfecto! Tu perfil está listo' : '¡Preferencias actualizadas!'}
                    </h2>
                    
                    <p className="text-lg text-cozy-medium-gray font-cozy mb-6">
                        {isFirstTime 
                            ? 'Hemos recopilado toda tu información para personalizar tu experiencia de lectura'
                            : 'Tus nuevas preferencias han sido guardadas'
                        }
                    </p>

                    {/* Estadísticas rápidas */}
                    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-cozy-sage">{genres.length}</div>
                            <div className="text-sm text-cozy-medium-gray">Géneros</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-cozy-terracotta">{readBooks.length}</div>
                            <div className="text-sm text-cozy-medium-gray">Leídos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-cozy-soft-yellow">{abandonedBooks.length}</div>
                            <div className="text-sm text-cozy-medium-gray">Pausados</div>
                        </div>
                    </div>
                </div>
            </CardCozy>

            {/* Resumen de información */}
            <div className="space-y-6 mb-8">
                {/* Preferencias */}
                <PreferencesSummary pace={pace} genres={genres} />
                
                {/* Libros leídos */}
                <BooksSummary
                    books={readBooks}
                    title="Libros Favoritos"
                    icon={BookCozyIcon}
                    emptyMessage="No se añadieron libros leídos"
                    color="cozy-sage"
                />
                
                {/* Libros abandonados */}
                {(abandonedBooks.length > 0 || isFirstTime) && (
                    <BooksSummary
                        books={abandonedBooks}
                        title="Libros Pausados"
                        icon={ClockCozyIcon}
                        emptyMessage="No se añadieron libros pausados"
                        color="cozy-soft-yellow"
                    />
                )}
            </div>

            {/* Mensaje motivacional */}
            <CardCozy variant="warm" className="mb-8 p-6 text-center bg-gradient-to-r from-cozy-sage/10 to-cozy-terracotta/10">
                <MagicCozyIcon className="w-8 h-8 text-cozy-terracotta mx-auto mb-3" />
                <h3 className="text-xl font-bold font-cozy-display text-cozy-warm-brown mb-2">
                    {isFirstTime ? '🎉 ¡Bienvenido a tu aventura literaria!' : '✨ ¡Cambios guardados!'}
                </h3>
                <p className="text-cozy-medium-gray font-cozy">
                    {isFirstTime 
                        ? 'Estamos emocionados de ayudarte a descubrir tu próxima lectura favorita. ¡Vamos al dashboard!'
                        : 'Tus preferencias actualizadas nos ayudarán a darte mejores recomendaciones.'
                    }
                </p>
            </CardCozy>

            {/* Botones de acción */}
            <div className="flex justify-between items-center">
                <ButtonCozy
                    variant="ghost"
                    onClick={onPrev}
                    disabled={isSubmitting}
                    className="min-w-32"
                >
                    <span className="flex items-center gap-2">
                        <Edit3 className="w-4 h-4" />
                        Editar
                    </span>
                </ButtonCozy>

                <ButtonCozy
                    variant="primary"
                    size="lg"
                    onClick={handleComplete}
                    disabled={isSubmitting}
                    className="min-w-64 cozy-shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-r from-cozy-sage to-cozy-terracotta text-white border-0"
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Guardando...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            {isFirstTime ? 'Comenzar mi aventura' : 'Guardar cambios'}
                            <ArrowRight className="w-5 h-5" />
                        </span>
                    )}
                </ButtonCozy>
            </div>

            {/* Mensaje final */}
            <div className="mt-8 text-center">
                <p className="text-sm text-cozy-light-gray font-cozy">
                    {isFirstTime 
                        ? '📚 Recuerda: siempre puedes actualizar tus preferencias desde tu perfil'
                        : '🔄 Los cambios se aplicarán inmediatamente a tus recomendaciones'
                    }
                </p>
            </div>
        </div>
    );
}
