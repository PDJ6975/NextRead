'use client';

import { useState, useEffect } from 'react';
import { ButtonCozy } from '../ui/cozy/ButtonCozy';
import { CardCozy } from '../ui/cozy/CardCozy';
import { 
    HeartCozyIcon, 
    BookCozyIcon, 
    FastBookCozyIcon,
    CheckMarkCozyIcon, 
    StarCozyIcon,
    RomanceCozyIcon,
    FantasyCozyIcon,
    SciFiCozyIcon,
    MysteryCozyIcon,
    ThrillerCozyIcon,
    ContemporaryCozyIcon,
    LiteraryCozyIcon,
    HistoricalCozyIcon,
    NonFictionCozyIcon,
    BiographyCozyIcon,
    SelfHelpCozyIcon,
    YoungAdultCozyIcon,
    HorrorCozyIcon,
    AdventureCozyIcon,
    LoadingCozyIcon,
    // Íconos adicionales para más géneros
    PoetryCozyIcon,
    ClassicCozyIcon,
    ChildrenCozyIcon,
    GraphicNovelCozyIcon,
    MemoirCozyIcon,
    DystopianCozyIcon,
    CrimeCozyIcon,
    PhilosophyCozyIcon,
    ReligionCozyIcon,
    BusinessCozyIcon,
    TechnologyCozyIcon,
    HumorCozyIcon,
    CookingCozyIcon,
    TravelCozyIcon,
    HealthFitnessCozyIcon,
    ArtDesignCozyIcon,
    EducationCozyIcon
} from '../ui/cozy/IconCozy';

// Función para formatear nombres de géneros a español legible
const formatGenreName = (genreName) => {
    if (!genreName) return 'Género';
    
    const nameMap = {
        'FANTASY': 'Fantasía',
        'SCIENCE_FICTION': 'Ciencia Ficción',
        'ROMANCE': 'Romance',
        'THRILLER': 'Thriller',
        'MYSTERY': 'Misterio',
        'HORROR': 'Terror',
        'HISTORICAL_FICTION': 'Ficción Histórica',
        'NON_FICTION': 'No Ficción',
        'BIOGRAPHY': 'Biografía',
        'SELF_HELP': 'Autoayuda',
        'POETRY': 'Poesía',
        'CLASSIC': 'Clásicos',
        'YOUNG_ADULT': 'Juvenil',
        'CHILDREN': 'Infantil',
        'GRAPHIC_NOVEL': 'Novela Gráfica',
        'MEMOIR': 'Memorias',
        'DYSTOPIAN': 'Distopía',
        'CRIME': 'Crimen',
        'ADVENTURE': 'Aventura',
        'LITERARY_FICTION': 'Ficción Literaria',
        'PHILOSOPHY': 'Filosofía',
        'RELIGION': 'Religión',
        'BUSINESS': 'Negocios',
        'TECHNOLOGY': 'Tecnología',
        'HUMOR': 'Humor',
        'COOKING': 'Cocina',
        'TRAVEL': 'Viajes',
        'HEALTH_FITNESS': 'Salud y Fitness',
        'ART_DESIGN': 'Arte y Diseño',
        'EDUCATION': 'Educación',
        'CONTEMPORARY_FICTION': 'Ficción Contemporánea'
    };
    
    return nameMap[genreName] || genreName.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

// Mapeo de géneros del backend a iconos cozy
const getGenreIcon = (genreName) => {
    if (!genreName) return BookCozyIcon;
    
    const iconMap = {
        'ROMANCE': RomanceCozyIcon,               // ❤️ Corazón - perfecto para romance
        'FANTASY': FantasyCozyIcon,               // 🌟 Estrella mágica - ideal para fantasía
        'SCIENCE_FICTION': SciFiCozyIcon,         // 🚀 Cohete - clásico sci-fi
        'MYSTERY': MysteryCozyIcon,               // 🔍 Lupa - ideal para misterio
        'THRILLER': ThrillerCozyIcon,             // ⚡ Rayo - tension y velocidad
        'CONTEMPORARY_FICTION': ContemporaryCozyIcon, // 🏙️ Ciudad - ficción contemporánea
        'LITERARY_FICTION': LiteraryCozyIcon,     // 📚 Libro clásico - literatura
        'HISTORICAL_FICTION': HistoricalCozyIcon, // 📜 Pergamino - historia
        'NON_FICTION': NonFictionCozyIcon,        // ⏰ Reloj - tiempo/realidad
        'BIOGRAPHY': BiographyCozyIcon,           // 👤 Persona - biografías
        'SELF_HELP': SelfHelpCozyIcon,           // ⭐ Estrella con check - mejora personal
        'YOUNG_ADULT': YoungAdultCozyIcon,       // 😊 Cara sonriente - juvenil
        'HORROR': HorrorCozyIcon,                // 😱 Cara asustada - terror
        'ADVENTURE': AdventureCozyIcon,          // ⛰️ Montaña - aventura
        // Géneros adicionales con íconos específicos
        'POETRY': PoetryCozyIcon,                // ✨ Estrella poética - poesía
        'CLASSIC': ClassicCozyIcon,              // 📖 Libro con sello - clásicos
        'CHILDREN': ChildrenCozyIcon,            // 😄 Cara infantil feliz - infantil
        'GRAPHIC_NOVEL': GraphicNovelCozyIcon,   // 📊 Comic/gráfico - novela gráfica
        'MEMOIR': MemoirCozyIcon,                // 👤 Persona con círculo - memorias
        'DYSTOPIAN': DystopianCozyIcon,          // ⚔️ X en círculo - distopía
        'CRIME': CrimeCozyIcon,                  // 🛡️ Escudo - crimen/policíaco
        'PHILOSOPHY': PhilosophyCozyIcon,        // ❓ Signo pregunta - filosofía
        'RELIGION': ReligionCozyIcon,            // ✝️ Cruz - religión
        'BUSINESS': BusinessCozyIcon,            // 💼 Maletín con check - negocios
        'TECHNOLOGY': TechnologyCozyIcon,        // 💻 Monitor - tecnología
        'HUMOR': HumorCozyIcon,                  // 😂 Cara riéndose - humor
        'COOKING': CookingCozyIcon,              // 🍳 Olla - cocina
        'TRAVEL': TravelCozyIcon,                // 🌍 Globo - viajes
        'HEALTH_FITNESS': HealthFitnessCozyIcon, // ➕ Cruz médica - salud
        'ART_DESIGN': ArtDesignCozyIcon,         // 🎨 Paleta artística - arte
        'EDUCATION': EducationCozyIcon           // 🎓 Gorro graduación - educación
    };
    return iconMap[genreName] || BookCozyIcon;
};

// Mapeo de géneros a colores
const getGenreColor = (genreName) => {
    if (!genreName) return 'cozy-sage';
    
    const colorMap = {
        'ROMANCE': 'cozy-terracotta',
        'FANTASY': 'cozy-lavender',
        'SCIENCE_FICTION': 'cozy-sage',
        'MYSTERY': 'cozy-warm-brown',
        'THRILLER': 'cozy-dark-gray',
        'CONTEMPORARY_FICTION': 'cozy-mint',
        'LITERARY_FICTION': 'cozy-soft-yellow',
        'HISTORICAL_FICTION': 'cozy-terracotta',
        'NON_FICTION': 'cozy-forest',
        'BIOGRAPHY': 'cozy-sage',
        'SELF_HELP': 'cozy-soft-yellow',
        'YOUNG_ADULT': 'cozy-lavender',
        'HORROR': 'cozy-dark-gray',
        'ADVENTURE': 'cozy-mint',
        // Géneros adicionales del backend
        'POETRY': 'cozy-lavender',
        'CLASSIC': 'cozy-warm-brown',
        'CHILDREN': 'cozy-soft-yellow',
        'GRAPHIC_NOVEL': 'cozy-mint',
        'MEMOIR': 'cozy-terracotta',
        'DYSTOPIAN': 'cozy-dark-gray',
        'CRIME': 'cozy-warm-brown',
        'PHILOSOPHY': 'cozy-forest',
        'RELIGION': 'cozy-sage',
        'BUSINESS': 'cozy-forest',
        'TECHNOLOGY': 'cozy-sage',
        'HUMOR': 'cozy-soft-yellow',
        'COOKING': 'cozy-terracotta',
        'TRAVEL': 'cozy-mint',
        'HEALTH_FITNESS': 'cozy-forest',
        'ART_DESIGN': 'cozy-lavender',
        'EDUCATION': 'cozy-sage'
    };
    return colorMap[genreName] || 'cozy-sage';
};

// Configuración de ritmos de lectura con iconos cozy
const paceOptions = [
    {
        id: 'SLOW',
        title: 'Libros Reflexivos',
        description: 'Me gustan los libros que requieren atención, con tramas profundas y desarrollo de personajes',
        icon: BookCozyIcon,
        color: 'cozy-sage',
        books: 'Narrativa densa, clásicos, ensayos...'
    },
    {
        id: 'FAST',
        title: 'Libros Dinámicos',
        description: 'Me gustan los libros que son rápidos y emocionantes, con mucha acción y sorpresas',
        icon: FastBookCozyIcon,
        color: 'cozy-terracotta',
        books: 'Thrillers, aventuras, romance...'
    }
];

export function PreferencesStepCozy({ data, onNext, onDataChange }) {
    const [selectedPace, setSelectedPace] = useState(data.pace || '');
    const [selectedGenres, setSelectedGenres] = useState(data.genres || []);
    const [availableGenres, setAvailableGenres] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadGenres();
    }, []);

    const loadGenres = async () => {
        try {
            const { genreService } = await import('../../services/genreService');
            const response = await genreService.getAllGenres();
            setAvailableGenres(response.data || []);
        } catch (error) {
            console.error('Error al cargar géneros:', error);
            setError('Error al cargar los géneros disponibles');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaceSelect = (pace) => {
        setSelectedPace(pace);
        onDataChange({ pace });
    };

    const handleGenreToggle = (genreId) => {
        const newGenres = selectedGenres.includes(genreId)
            ? selectedGenres.filter(id => id !== genreId)
            : [...selectedGenres, genreId];
        
        setSelectedGenres(newGenres);
        onDataChange({ genres: newGenres });
    };

    const handleNext = () => {
        if (selectedPace && selectedGenres.length > 0) {
            setIsAnimating(true);
            setTimeout(() => {
                onNext();
            }, 300);
        }
    };

    const isValid = selectedPace && selectedGenres.length > 0;

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto text-center py-12">
                <LoadingCozyIcon size="2xl" className="text-cozy-sage mx-auto mb-4" />
                <p className="text-cozy-medium-gray font-cozy">Cargando géneros...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto text-center py-12">
                <CardCozy variant="warm" className="border-cozy-terracotta/30 bg-cozy-terracotta/10 p-6">
                    <p className="text-cozy-terracotta font-cozy font-medium">{error}</p>
                </CardCozy>
            </div>
        );
    }

    return (
        <div className={`max-w-4xl mx-auto transition-all duration-300 ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
            {/* Sección de Ritmo de Lectura */}
            <CardCozy variant="magical" className="mb-8 p-6">
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold font-cozy-display text-cozy-warm-brown mb-2">
                        ¿Cuál es tu ritmo de lectura?
                    </h3>
                    <p className="text-cozy-medium-gray font-cozy">
                        Esto nos ayudará a conocer mejor qué tipo de libros te interesan
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paceOptions.map((option) => (
                        <div
                            key={option.id}
                            className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                                selectedPace === option.id ? 'scale-105' : ''
                            }`}
                            onClick={() => handlePaceSelect(option.id)}
                        >
                            <CardCozy
                                variant={selectedPace === option.id ? 'warm' : 'soft'}
                                className={`h-full p-4 border-2 transition-all duration-300 ${
                                    selectedPace === option.id
                                        ? `border-${option.color} cozy-shadow-lg bg-${option.color}/10`
                                        : 'border-cozy-light-gray hover:border-cozy-medium-gray'
                                }`}
                            >
                                <div className="text-center">
                                    <div className="mb-3 flex justify-center">
                                        <option.icon className={`w-9 h-9 ${selectedPace === option.id ? `text-${option.color}` : 'text-cozy-medium-gray'} transition-colors duration-300`} />
                                    </div>
                                    <h4 className="font-bold font-cozy-display text-cozy-warm-brown mb-2">
                                        {option.title}
                                    </h4>
                                    <p className="text-sm text-cozy-medium-gray font-cozy mb-2">
                                        {option.description}
                                    </p>
                                    <div className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${
                                        selectedPace === option.id
                                            ? `bg-${option.color} text-white`
                                            : 'bg-cozy-light-gray text-cozy-medium-gray'
                                    }`}>
                                        {option.books}
                                    </div>
                                    
                                    {/* Indicador de selección */}
                                    {selectedPace === option.id && (
                                        <div className="mt-3">
                                            <CheckMarkCozyIcon className={`w-6 h-6 text-${option.color} mx-auto animate-bounce`} />
                                        </div>
                                    )}
                                </div>
                            </CardCozy>
                        </div>
                    ))}
                </div>
            </CardCozy>

            {/* Sección de Géneros Favoritos */}
            <CardCozy variant="magical" className="p-6">
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold font-cozy-display text-cozy-warm-brown mb-2">
                        ¿Qué géneros te gustan?
                    </h3>
                    <p className="text-cozy-medium-gray font-cozy">
                        Selecciona todos los que te interesen (mínimo 1)
                    </p>
                    {selectedGenres.length > 0 && (
                        <div className="mt-2">
                            <span className="text-sm font-medium text-cozy-sage bg-cozy-sage/10 px-3 py-1 rounded-full">
                                {selectedGenres.length} seleccionado{selectedGenres.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {availableGenres.map((genre) => {
                        // Usar el campo correcto del backend
                        const genreName = genre.selectedGenre || genre.name || 'Género';
                        const IconComponent = getGenreIcon(genreName);
                        const isSelected = selectedGenres.includes(genre.id);
                        const color = getGenreColor(genreName);
                        
                        return (
                            <div
                                key={genre.id}
                                className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                                    isSelected ? 'scale-105' : ''
                                }`}
                                onClick={() => handleGenreToggle(genre.id)}
                            >
                                <CardCozy
                                    variant={isSelected ? 'warm' : 'soft'}
                                    className={`h-full p-3 border-2 transition-all duration-300 ${
                                        isSelected
                                            ? `border-${color} cozy-shadow-md bg-${color}/10`
                                            : 'border-cozy-light-gray hover:border-cozy-medium-gray'
                                    }`}
                                >
                                    <div className="text-center">
                                        <IconComponent 
                                            className={`w-6 h-6 mx-auto mb-2 transition-colors duration-300 ${
                                                isSelected ? `text-${color}` : 'text-cozy-medium-gray'
                                            }`} 
                                        />
                                        <p className={`text-sm font-medium font-cozy transition-colors duration-300 ${
                                            isSelected ? 'text-cozy-warm-brown' : 'text-cozy-medium-gray'
                                        }`}>
                                            {formatGenreName(genre.selectedGenre)}
                                        </p>
                                        
                                        {/* Marca de verificación con efecto de tinta */}
                                        {isSelected && (
                                            <div className="mt-1">
                                                <div className={`w-3 h-3 rounded-full bg-${color} mx-auto animate-ping`} />
                                            </div>
                                        )}
                                    </div>
                                </CardCozy>
                            </div>
                        );
                    })}
                </div>
            </CardCozy>

            {/* Botón de Continuar */}
            <div className="mt-8 flex justify-center">
                <ButtonCozy
                    variant={isValid ? 'primary' : 'secondary'}
                    size="lg"
                    onClick={handleNext}
                    disabled={!isValid}
                    className={`min-w-48 transition-all duration-300 ${
                        isValid ? 'cozy-shadow-lg hover:scale-105' : 'opacity-50 cursor-not-allowed'
                    }`}
                >
                    <span className="flex items-center gap-2">
                        Continuar
                        <StarCozyIcon className="w-5 h-5" />
                    </span>
                </ButtonCozy>
            </div>

            {/* Indicador de validación */}
            {!isValid && (selectedPace || selectedGenres.length > 0) && (
                <div className="mt-4 text-center">
                    <p className="text-sm text-cozy-medium-gray font-cozy">
                        {!selectedPace && 'Selecciona tu ritmo de lectura'}
                        {selectedPace && selectedGenres.length === 0 && 'Selecciona al menos un género'}
                    </p>
                </div>
            )}
        </div>
    );
}
