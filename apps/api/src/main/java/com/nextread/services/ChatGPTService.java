package com.nextread.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nextread.dto.GeneratedRecommendationDTO;
import com.nextread.entities.GenreSelection;
import com.nextread.entities.PaceSelection;
import com.nextread.entities.ReadingStatus;
import com.nextread.entities.Survey;
import com.nextread.entities.User;
import com.nextread.entities.UserBook;
import com.nextread.entities.Book;
import com.nextread.entities.Author;

@Service
public class ChatGPTService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final SurveyService surveyService;
    private final UserBookService userBookService;
    private final BookService bookService;

    @Autowired
    public ChatGPTService(RestTemplate restTemplate,
            ObjectMapper objectMapper,
            SurveyService surveyService,
            @Lazy UserBookService userBookService,
            BookService bookService) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.surveyService = surveyService;
        this.userBookService = userBookService;
        this.bookService = bookService;
    }

    /**
     * Genera recomendaciones de libros basadas en la encuesta del usuario
     * utilizando la API de ChatGPT.
     * 
     * @param user          El usuario para quien generar recomendaciones
     * @param rejectedBooks Lista de libros rechazados recientemente que deben
     *                      evitarse
     * @return Lista de exactamente 3 recomendaciones completamente enriquecidas
     */
    public List<GeneratedRecommendationDTO> generateRecommendations(User user, List<Book> rejectedBooks) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new RuntimeException("API key de OpenAI no configurada");
        }

        try {
            // Obtener datos del usuario
            Survey survey = surveyService.findSurveyByUser(user);

            // Validar que la encuesta ya se haya completado
            if (survey.getFirstTime().equals(Boolean.TRUE)) {
                throw new RuntimeException(
                        "Se debe completar la encuesta base para poder comenzar con las recomendaciones.");
            }

            List<UserBook> userBooks = userBookService.findUserBooks(user);

            // Generar exactamente 3 recomendaciones completamente enriquecidas
            List<GeneratedRecommendationDTO> finalRecommendations = new ArrayList<>();
            int maxAttempts = 5; // Máximo 5 intentos para evitar loops infinitos
            int currentAttempt = 0;

            while (finalRecommendations.size() < 3 && currentAttempt < maxAttempts) {
                currentAttempt++;

                // Construir prompt personalizado incluyendo libros rechazados
                String prompt = buildPrompt(survey, userBooks, rejectedBooks);

                // Llamar a la API de ChatGPT
                String response = callChatGPTAPI(prompt);

                // Parsear la respuesta y convertir a DTOs
                List<GeneratedRecommendationDTO> result = parseRecommendations(response);

                // Procesar las recomendaciones una por una hasta encontrar una enriquecida
                if (result != null && !result.isEmpty()) {
                    for (GeneratedRecommendationDTO rec : result) {
                        // Verificar que no sea duplicado
                        boolean isDuplicate = finalRecommendations.stream()
                                .anyMatch(existing -> existing.getTitle().equalsIgnoreCase(rec.getTitle()));

                        if (!isDuplicate) {
                            // Intentar enriquecer esta recomendación específica
                            GeneratedRecommendationDTO enrichedRec = enrichSingleRecommendation(rec);

                            if (enrichedRec != null && enrichedRec.isEnriched()) {
                                finalRecommendations.add(enrichedRec);

                                // Si ya tenemos 3 recomendaciones válidas, salir del bucle
                                if (finalRecommendations.size() >= 3) {
                                    break;
                                }
                            }
                        }
                    }
                }

                // Si no se pudo enriquecer ninguna recomendación, continuar con el siguiente
                // intento
                if (result == null || result.isEmpty() ||
                        result.stream().noneMatch(rec -> {
                            GeneratedRecommendationDTO enriched = enrichSingleRecommendation(rec);
                            return enriched != null && enriched.isEnriched();
                        })) {
                    // Continuar con el siguiente intento
                }
            }

            return finalRecommendations;

        } catch (Exception e) {
            throw new RuntimeException("Error al generar recomendaciones: " + e.getMessage());
        }
    }

    /**
     * Construye el prompt personalizado basado en la encuesta y libros del usuario.
     * 
     * @param survey        La encuesta del usuario
     * @param userBooks     Los libros del usuario
     * @param rejectedBooks Lista de libros rechazados recientemente que deben
     *                      evitarse
     * @return Prompt personalizado para ChatGPT
     */
    private String buildPrompt(Survey survey, List<UserBook> userBooks, List<Book> rejectedBooks) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("Eres un experto en recomendaciones de libros. ");
        prompt.append("Basándote en la siguiente información del usuario, recomienda exactamente 3 libros DIVERSOS. ");

        // Información de la encuesta
        prompt.append("Preferencias del usuario:\n");
        prompt.append("- Ritmo de lectura: ").append(formatPace(survey.getPace())).append("\n");
        prompt.append("- Géneros favoritos: ");
        survey.getSelectedGenres().forEach(genre -> prompt.append(formatGenre(genre.getSelectedGenre())).append(", "));
        prompt.append("\n");

        // Información de libros del usuario
        if (!userBooks.isEmpty()) {
            prompt.append("Historial de libros del usuario:\n");
            userBooks.forEach(userBook -> {
                prompt.append("- ").append(userBook.getBook().getTitle());

                if (userBook.getStatus().equals(ReadingStatus.READ)) {
                    prompt.append(" (LEÍDO COMPLETAMENTE");
                    if (userBook.getRating() != null) {
                        prompt.append(" - Valoración: ").append(userBook.getRating()).append("/5");
                    }
                    prompt.append(")");
                } else if (userBook.getStatus().equals(ReadingStatus.ABANDONED)) {
                    prompt.append(" (NO TERMINADO - No le gustó al usuario, por eso lo abandonó)");
                } else {
                    prompt.append(" (Estado: ").append(userBook.getStatus()).append(")");
                    if (userBook.getRating() != null) {
                        prompt.append(" - Valoración: ").append(userBook.getRating()).append("/5");
                    }
                }
                prompt.append("\n");
            });

            prompt.append("\nIMPORTANTE: Los libros marcados como 'NO TERMINADO' son libros que el usuario ");
            prompt.append("abandonó porque NO le gustaron. Evita recomendar libros similares a estos. ");
            prompt.append(
                    "Los libros 'LEÍDO COMPLETAMENTE' con buenas valoraciones (4-5/5) indican sus gustos preferidos.\n");
        }

        // Información de libros rechazados
        if (!rejectedBooks.isEmpty()) {
            prompt.append("\nLibros rechazados recientemente:\n");
            rejectedBooks.forEach(book -> {
                prompt.append("- ").append(book.getTitle()).append("\n");
            });
            prompt.append("Evita recomendar libros similares a estos.\n");
        }

        prompt.append("\nINSTRUCCIONES ESPECÍFICAS:\n");
        prompt.append("1. Genera EXACTAMENTE 3 recomendaciones DIVERSAS\n");
        prompt.append("2. Evita recomendar libros que el usuario ya haya leído o abandonado\n");
        prompt.append("3. Incluye variedad en géneros y autores\n");
        prompt.append("4. Asegúrate de que los títulos sean exactos y reconocibles\n");
        prompt.append("5. Cada recomendación debe ser única y diferente a las otras\n\n");

        prompt.append("Por favor, responde ÚNICAMENTE con un JSON válido con el siguiente formato:\n");
        prompt.append("[\n");
        prompt.append("  {\n");
        prompt.append("    \"title\": \"Título exacto del libro\",\n");
        prompt.append(
                "    \"reason\": \"Razón específica de la recomendación basada en las preferencias del usuario\"\n");
        prompt.append("  }\n");
        prompt.append("]\n");
        prompt.append("Asegúrate de que sea JSON válido y que contenga exactamente 3 libros. ");
        prompt.append("Es muy importante que el título sea exacto para poder encontrar el libro. ");
        prompt.append(
                "IMPORTANTE: Responde SOLO con el JSON, sin texto adicional, sin bloques de código markdown (```), sin explicaciones. Solo el JSON puro.");

        return prompt.toString();
    }

    /**
     * Realiza la llamada a la API de ChatGPT.
     * 
     * @param prompt El prompt a enviar a ChatGPT
     * @return Respuesta de la API de ChatGPT
     */
    private String callChatGPTAPI(String prompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> requestBody = Map.of(
                    "model", "gpt-4o-mini",
                    "messages", List.of(
                            Map.of("role", "user", "content", prompt)),
                    "max_tokens", 500,
                    "temperature", 0.7);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    apiUrl,
                    HttpMethod.POST,
                    request,
                    String.class);

            String extractedContent = extractContentFromResponse(response.getBody());
            return extractedContent;

        } catch (Exception e) {
            throw e;
        }
    }

    /**
     * Extrae el contenido de la respuesta de ChatGPT.
     * 
     * @param response La respuesta completa de la API
     * @return El contenido extraído de la respuesta
     */
    private String extractContentFromResponse(String response) {
        try {
            JsonNode root = objectMapper.readTree(response);
            String content = root.path("choices").get(0).path("message").path("content").asText();
            return content;
        } catch (Exception e) {
            throw new RuntimeException("Error al parsear respuesta de ChatGPT: " + e.getMessage());
        }
    }

    /**
     * Parsea las recomendaciones de la respuesta JSON.
     * 
     * @param jsonResponse La respuesta JSON de ChatGPT
     * @return Lista de recomendaciones parseadas
     */
    private List<GeneratedRecommendationDTO> parseRecommendations(String jsonResponse) {
        try {
            // Limpiar la respuesta de bloques de código markdown
            String cleanedJson = cleanJsonResponse(jsonResponse);

            JsonNode recommendations = objectMapper.readTree(cleanedJson);

            List<GeneratedRecommendationDTO> result = new ArrayList<>();

            for (JsonNode recommendation : recommendations) {
                String title = recommendation.path("title").asText();
                String reason = recommendation.path("reason").asText();

                // Validar que title y reason no estén vacíos
                if (title != null && !title.trim().isEmpty() && reason != null && !reason.trim().isEmpty()) {
                    GeneratedRecommendationDTO dto = GeneratedRecommendationDTO.builder()
                            .title(title.trim())
                            .reason(reason.trim())
                            .build();
                    result.add(dto);
                }
            }

            // Validar que tengamos al menos una recomendación
            if (result.isEmpty()) {
                throw new RuntimeException("No se pudieron generar recomendaciones válidas");
            }

            return result;
        } catch (Exception e) {
            throw new RuntimeException("Error al parsear recomendaciones: " + e.getMessage());
        }
    }

    /**
     * Limpia la respuesta de ChatGPT removiendo bloques de código markdown y otros
     * caracteres problemáticos.
     * 
     * @param response La respuesta cruda de ChatGPT
     * @return JSON limpio listo para parsear
     */
    private String cleanJsonResponse(String response) {
        if (response == null || response.trim().isEmpty()) {
            throw new RuntimeException("Respuesta vacía de ChatGPT");
        }

        String cleaned = response.trim();

        // Remover bloques de código markdown variantes
        cleaned = cleaned.replaceAll("```json\\s*", "");
        cleaned = cleaned.replaceAll("```JSON\\s*", "");
        cleaned = cleaned.replaceAll("```\\s*json\\s*", "");
        cleaned = cleaned.replaceAll("```\\s*", "");

        // Remover comillas triples que puedan quedar
        cleaned = cleaned.replaceAll("```", "");

        // Remover texto explicativo común antes del JSON (solo si no empieza con [ o {)
        if (!cleaned.startsWith("[") && !cleaned.startsWith("{")) {
            cleaned = cleaned.replaceAll("(?i).*?(?=\\[|\\{)", "");
        }

        // Buscar el inicio del JSON más precisamente
        int arrayStart = cleaned.indexOf('[');
        int objectStart = cleaned.indexOf('{');

        int jsonStart = -1;
        if (arrayStart != -1 && objectStart != -1) {
            jsonStart = Math.min(arrayStart, objectStart);
        } else if (arrayStart != -1) {
            jsonStart = arrayStart;
        } else if (objectStart != -1) {
            jsonStart = objectStart;
        }

        if (jsonStart > 0) {
            cleaned = cleaned.substring(jsonStart);
        } else if (jsonStart == -1) {
            throw new RuntimeException("No se encontró JSON válido en la respuesta de ChatGPT");
        }

        // Buscar el final del JSON más precisamente
        int arrayEnd = cleaned.lastIndexOf(']');
        int objectEnd = cleaned.lastIndexOf('}');

        int jsonEnd = Math.max(arrayEnd, objectEnd);
        if (jsonEnd >= 0 && jsonEnd < cleaned.length() - 1) {
            cleaned = cleaned.substring(0, jsonEnd + 1);
        }

        // Limpiar espacios y caracteres de control
        cleaned = cleaned.trim();

        // Validación básica de estructura JSON
        if (!cleaned.startsWith("[") && !cleaned.startsWith("{")) {
            throw new RuntimeException("La respuesta limpiada no parece ser JSON válido: "
                    + cleaned.substring(0, Math.min(50, cleaned.length())));
        }

        return cleaned;
    }

    /**
     * Enriquece una sola recomendación con información adicional de libros.
     * 
     * @param recommendation La recomendación básica a enriquecer
     * @return La recomendación enriquecida o null si no se pudo enriquecer
     */
    private GeneratedRecommendationDTO enrichSingleRecommendation(GeneratedRecommendationDTO recommendation) {
        try {
            // Intentar encontrar el libro usando el método existente findRecommendedBook
            // Este método busca en BD local primero, luego en Google Books
            Book book = bookService.findRecommendedBook(recommendation.getTitle());

            if (book != null) {
                // Convertir autores a lista de strings
                List<String> authorNames = new ArrayList<>();
                if (book.getAuthors() != null && !book.getAuthors().isEmpty()) {
                    authorNames = book.getAuthors().stream()
                            .map(Author::getName)
                            .collect(Collectors.toList());
                }

                return GeneratedRecommendationDTO.builder()
                        .title(book.getTitle())
                        .reason(recommendation.getReason())
                        .coverUrl(book.getCoverUrl())
                        .isbn13(book.getIsbn13())
                        .isbn10(book.getIsbn10())
                        .publisher(book.getPublisher())
                        .publishedYear(book.getPublishedYear())
                        .pages(book.getPages())
                        .synopsis(book.getSynopsis())
                        .authors(authorNames)
                        .bookId(book.getId()) // Solo si el libro existe en BD local
                        .enriched(true)
                        .build();
            } else {
                return null; // No añadir recomendaciones incompletas
            }
        } catch (Exception e) {
            return null; // No añadir recomendaciones con errores
        }
    }

    /**
     * Formatea el ritmo de lectura para el prompt.
     * 
     * @param pace El ritmo de lectura seleccionado
     * @return Descripción formateada del ritmo
     */
    private String formatPace(PaceSelection pace) {
        return switch (pace) {
            case SLOW ->
                "Lento (prefiere libros que pueda leer tranquilamente, con una dinámica más calmada y a los que hay que prestar más atención)";
            case FAST ->
                "Rápido (prefiere libros que pueda leer rápidamente, sin poner mucha atención a todo lo que ocurre y con capítulos muy dinámicos en los que siempre ocurran cosas)";
        };
    }

    /**
     * Formatea el género para el prompt.
     * 
     * @param genre El género seleccionado
     * @return Nombre formateado del género
     */
    private String formatGenre(GenreSelection genre) {
        return switch (genre) {
            case FANTASY -> "Fantasía";
            case SCIENCE_FICTION -> "Ciencia Ficción";
            case ROMANCE -> "Romance";
            case THRILLER -> "Thriller";
            case MYSTERY -> "Misterio";
            case HORROR -> "Terror";
            case HISTORICAL_FICTION -> "Ficción Histórica";
            case NON_FICTION -> "No Ficción";
            case BIOGRAPHY -> "Biografía";
            case SELF_HELP -> "Autoayuda";
            case POETRY -> "Poesía";
            case CLASSIC -> "Clásico";
            case YOUNG_ADULT -> "Juvenil";
            case CHILDREN -> "Infantil";
            case GRAPHIC_NOVEL -> "Novela Gráfica";
            case MEMOIR -> "Memorias";
            case DYSTOPIAN -> "Distópico";
            case CRIME -> "Crimen";
            case ADVENTURE -> "Aventura";
            case LITERARY_FICTION -> "Ficción Literaria";
            case PHILOSOPHY -> "Filosofía";
            case RELIGION -> "Religión";
            case BUSINESS -> "Negocios";
            case TECHNOLOGY -> "Tecnología";
            case HUMOR -> "Humor";
            case COOKING -> "Cocina";
            case TRAVEL -> "Viajes";
            case HEALTH_FITNESS -> "Salud y Fitness";
            case ART_DESIGN -> "Arte y Diseño";
            case EDUCATION -> "Educación";
        };
    }
}