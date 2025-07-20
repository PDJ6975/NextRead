export const genreTranslations = {
    FANTASY: 'Fantasía',
    SCIENCE_FICTION: 'Ciencia Ficción',
    ROMANCE: 'Romance',
    THRILLER: 'Thriller',
    MYSTERY: 'Misterio',
    HORROR: 'Terror',
    HISTORICAL_FICTION: 'Ficción Histórica',
    NON_FICTION: 'No Ficción',
    BIOGRAPHY: 'Biografía',
    SELF_HELP: 'Autoayuda',
    POETRY: 'Poesía',
    CLASSIC: 'Clásicos',
    YOUNG_ADULT: 'Juvenil',
    CHILDREN: 'Infantil',
    GRAPHIC_NOVEL: 'Novela Gráfica',
    MEMOIR: 'Memorias',
    DYSTOPIAN: 'Distópico',
    CRIME: 'Crimen',
    ADVENTURE: 'Aventura',
    LITERARY_FICTION: 'Ficción Literaria',
    PHILOSOPHY: 'Filosofía',
    RELIGION: 'Religión',
    BUSINESS: 'Negocios',
    TECHNOLOGY: 'Tecnología',
    HUMOR: 'Humor',
    COOKING: 'Cocina',
    TRAVEL: 'Viajes',
    HEALTH_FITNESS: 'Salud y Fitness',
    ART_DESIGN: 'Arte y Diseño',
    EDUCATION: 'Educación'
};

export const translateGenre = (genreKey) => {
    return genreTranslations[genreKey] || genreKey;
}; 