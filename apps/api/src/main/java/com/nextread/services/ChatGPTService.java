package com.nextread.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
            UserBookService userBookService,
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
     * @param user El usuario para quien generar recomendaciones
     * @return Lista de recomendaciones generadas
     */
    public List<GeneratedRecommendationDTO> generateRecommendations(User user) {
        System.out.println("🤖 [ChatGPTService] Iniciando generateRecommendations para usuario: " + user.getEmail());

        // Verificar API key
        System.out.println("🔑 [ChatGPTService] Verificando API key...");
        System.out.println(
                "🔑 [ChatGPTService] API key configurada: " + (apiKey != null && !apiKey.isEmpty() ? "SÍ" : "NO"));
        System.out.println("🔑 [ChatGPTService] API URL: " + apiUrl);

        if (apiKey == null || apiKey.isEmpty()) {
            System.err.println("❌ [ChatGPTService] API key de OpenAI no configurada");
            throw new RuntimeException("API key de OpenAI no configurada");
        }

        try {
            // Obtener datos del usuario
            System.out.println("📋 [ChatGPTService] Obteniendo encuesta del usuario...");
            Survey survey = surveyService.findSurveyByUser(user);
            System.out.println("📋 [ChatGPTService] Encuesta obtenida - ID: " + survey.getId());
            System.out.println("📋 [ChatGPTService] FirstTime: " + survey.getFirstTime());
            System.out.println("📋 [ChatGPTService] Pace: " + survey.getPace());
            System.out.println("📋 [ChatGPTService] Géneros seleccionados: "
                    + (survey.getSelectedGenres() != null ? survey.getSelectedGenres().size() : 0));

            // Validar que la encuesta ya se haya completado
            if (survey.getFirstTime().equals(Boolean.TRUE)) {
                System.err.println("❌ [ChatGPTService] Usuario no ha completado la encuesta base");
                throw new RuntimeException(
                        "Se debe completar la encuesta base para poder comenzar con las recomendaciones.");
            }

            System.out.println("📚 [ChatGPTService] Obteniendo libros del usuario...");
            List<UserBook> userBooks = userBookService.findUserBooks(user);
            System.out.println("📚 [ChatGPTService] Libros del usuario: " + (userBooks != null ? userBooks.size() : 0));

            // Construir prompt personalizado
            System.out.println("✍️ [ChatGPTService] Construyendo prompt...");
            String prompt = buildPrompt(survey, userBooks);
            System.out.println("✍️ [ChatGPTService] Prompt construido - Longitud: " + prompt.length() + " caracteres");
            System.out.println("✍️ [ChatGPTService] Prompt completo:");
            System.out.println("--- INICIO PROMPT ---");
            System.out.println(prompt);
            System.out.println("--- FIN PROMPT ---");

            // Llamar a la API de ChatGPT
            System.out.println("🌐 [ChatGPTService] Llamando a la API de ChatGPT...");
            String response = callChatGPTAPI(prompt);
            System.out.println("🌐 [ChatGPTService] Respuesta de ChatGPT recibida - Longitud: "
                    + (response != null ? response.length() : 0));
            System.out.println("🌐 [ChatGPTService] Respuesta completa:");
            System.out.println("--- INICIO RESPUESTA ---");
            System.out.println(response);
            System.out.println("--- FIN RESPUESTA ---");

            // Parsear la respuesta y convertir a DTOs
            System.out.println("🔄 [ChatGPTService] Parseando respuesta...");
            List<GeneratedRecommendationDTO> result = parseRecommendations(response);
            System.out.println("🔄 [ChatGPTService] Parsing completado - Recomendaciones: "
                    + (result != null ? result.size() : 0));

            // Enriquecer las recomendaciones con información adicional de libros
            System.out.println("📚 [ChatGPTService] Enriqueciendo recomendaciones con información de libros...");
            List<GeneratedRecommendationDTO> enrichedResult = enrichRecommendations(result);
            System.out.println("📚 [ChatGPTService] Enriquecimiento completado");

            if (enrichedResult != null && !enrichedResult.isEmpty()) {
                for (int i = 0; i < enrichedResult.size(); i++) {
                    GeneratedRecommendationDTO rec = enrichedResult.get(i);
                    System.out.println("📖 [ChatGPTService] Recomendación " + (i + 1) + ": " + rec.getTitle());
                    System.out.println("📖 [ChatGPTService] - Cover URL: " + (rec.getCoverUrl() != null ? "SÍ" : "NO"));
                    System.out.println("📖 [ChatGPTService] - Enriquecida: " + rec.isEnriched());
                    System.out.println("📖 [ChatGPTService] - Reason: " + rec.getReason());
                }
            }

            return enrichedResult;

        } catch (Exception e) {
            System.err.println("💥 [ChatGPTService] Error en generateRecommendations:");
            System.err.println("💥 [ChatGPTService] Tipo: " + e.getClass().getSimpleName());
            System.err.println("💥 [ChatGPTService] Mensaje: " + e.getMessage());
            System.err.println("💥 [ChatGPTService] Stack trace:");
            e.printStackTrace();
            throw new RuntimeException("Error al generar recomendaciones: " + e.getMessage());
        }
    }

    /**
     * Construye el prompt personalizado basado en la encuesta y libros del usuario.
     */
    private String buildPrompt(Survey survey, List<UserBook> userBooks) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("Eres un experto en recomendaciones de libros. ");
        prompt.append("Basándote en la siguiente información del usuario, recomienda exactamente 3 libros. ");

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

        prompt.append("\nPor favor, responde ÚNICAMENTE con un JSON válido con el siguiente formato:\n");
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
     */
    private String callChatGPTAPI(String prompt) {
        System.out.println("🌐 [ChatGPTService.callChatGPTAPI] Preparando llamada a API...");

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);
            System.out.println("🌐 [ChatGPTService.callChatGPTAPI] Headers configurados");

            Map<String, Object> requestBody = Map.of(
                    "model", "gpt-4o-mini",
                    "messages", List.of(
                            Map.of("role", "user", "content", prompt)),
                    "max_tokens", 500,
                    "temperature", 0.7);

            System.out.println("🌐 [ChatGPTService.callChatGPTAPI] Request body creado");
            System.out.println("🌐 [ChatGPTService.callChatGPTAPI] Modelo: gpt-4o-mini");
            System.out.println("🌐 [ChatGPTService.callChatGPTAPI] Max tokens: 500");
            System.out.println("🌐 [ChatGPTService.callChatGPTAPI] Temperature: 0.7");

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            System.out.println("🌐 [ChatGPTService.callChatGPTAPI] Realizando llamada HTTP a: " + apiUrl);
            ResponseEntity<String> response = restTemplate.exchange(
                    apiUrl,
                    HttpMethod.POST,
                    request,
                    String.class);

            System.out.println("🌐 [ChatGPTService.callChatGPTAPI] Respuesta HTTP recibida");
            System.out.println("🌐 [ChatGPTService.callChatGPTAPI] Status code: " + response.getStatusCode());
            System.out.println("🌐 [ChatGPTService.callChatGPTAPI] Response body length: "
                    + (response.getBody() != null ? response.getBody().length() : 0));

            String extractedContent = extractContentFromResponse(response.getBody());
            System.out.println("🌐 [ChatGPTService.callChatGPTAPI] Contenido extraído exitosamente");
            return extractedContent;

        } catch (Exception e) {
            System.err.println("💥 [ChatGPTService.callChatGPTAPI] Error en llamada a API:");
            System.err.println("💥 [ChatGPTService.callChatGPTAPI] Tipo: " + e.getClass().getSimpleName());
            System.err.println("💥 [ChatGPTService.callChatGPTAPI] Mensaje: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Extrae el contenido de la respuesta de ChatGPT.
     */
    private String extractContentFromResponse(String response) {
        System.out.println("🔄 [ChatGPTService.extractContentFromResponse] Extrayendo contenido...");

        try {
            JsonNode root = objectMapper.readTree(response);
            String content = root.path("choices").get(0).path("message").path("content").asText();
            System.out.println("🔄 [ChatGPTService.extractContentFromResponse] Contenido extraído exitosamente");
            return content;
        } catch (Exception e) {
            System.err.println("💥 [ChatGPTService.extractContentFromResponse] Error al parsear respuesta:");
            System.err.println("💥 [ChatGPTService.extractContentFromResponse] Respuesta original:");
            System.err.println(response);
            System.err.println("💥 [ChatGPTService.extractContentFromResponse] Error: " + e.getMessage());
            throw new RuntimeException("Error al parsear respuesta de ChatGPT: " + e.getMessage());
        }
    }

    /**
     * Parsea las recomendaciones de la respuesta JSON.
     */
    private List<GeneratedRecommendationDTO> parseRecommendations(String jsonResponse) {
        System.out.println("🔄 [ChatGPTService.parseRecommendations] Iniciando parsing...");
        System.out.println("🔄 [ChatGPTService.parseRecommendations] JSON a parsear:");
        System.out.println("--- INICIO JSON ---");
        System.out.println(jsonResponse);
        System.out.println("--- FIN JSON ---");

        try {
            // Limpiar la respuesta de bloques de código markdown
            String cleanedJson = cleanJsonResponse(jsonResponse);
            System.out.println("🧹 [ChatGPTService.parseRecommendations] JSON limpio:");
            System.out.println("--- INICIO JSON LIMPIO ---");
            System.out.println(cleanedJson);
            System.out.println("--- FIN JSON LIMPIO ---");

            JsonNode recommendations = objectMapper.readTree(cleanedJson);
            System.out.println("🔄 [ChatGPTService.parseRecommendations] JSON parseado exitosamente");
            System.out.println("🔄 [ChatGPTService.parseRecommendations] Es array: " + recommendations.isArray());
            System.out.println("🔄 [ChatGPTService.parseRecommendations] Tamaño: " + recommendations.size());

            List<GeneratedRecommendationDTO> result = new ArrayList<>();

            for (JsonNode recommendation : recommendations) {
                System.out.println("🔄 [ChatGPTService.parseRecommendations] Procesando recomendación...");
                String title = recommendation.path("title").asText();
                String reason = recommendation.path("reason").asText();
                System.out.println("🔄 [ChatGPTService.parseRecommendations] Title: " + title);
                System.out.println("🔄 [ChatGPTService.parseRecommendations] Reason: " + reason);

                // Validar que title y reason no estén vacíos
                if (title != null && !title.trim().isEmpty() && reason != null && !reason.trim().isEmpty()) {
                    GeneratedRecommendationDTO dto = GeneratedRecommendationDTO.builder()
                            .title(title.trim())
                            .reason(reason.trim())
                            .build();
                    result.add(dto);
                } else {
                    System.out.println(
                            "⚠️ [ChatGPTService.parseRecommendations] Recomendación inválida ignorada - Title: '"
                                    + title + "', Reason: '" + reason + "'");
                }
            }

            System.out.println("🔄 [ChatGPTService.parseRecommendations] Parsing completado - Total: " + result.size());

            // Validar que tengamos al menos una recomendación
            if (result.isEmpty()) {
                throw new RuntimeException("No se pudieron generar recomendaciones válidas");
            }

            return result;
        } catch (Exception e) {
            System.err.println("💥 [ChatGPTService.parseRecommendations] Error al parsear recomendaciones:");
            System.err.println("💥 [ChatGPTService.parseRecommendations] JSON problemático:");
            System.err.println(jsonResponse);
            System.err.println("💥 [ChatGPTService.parseRecommendations] Error: " + e.getMessage());
            e.printStackTrace();
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
        System.out.println("🧹 [ChatGPTService.cleanJsonResponse] Respuesta original: '" + cleaned + "'");

        // Remover bloques de código markdown variantes
        cleaned = cleaned.replaceAll("```json\\s*", "");
        cleaned = cleaned.replaceAll("```JSON\\s*", "");
        cleaned = cleaned.replaceAll("```\\s*json\\s*", "");
        cleaned = cleaned.replaceAll("```\\s*", "");

        // Remover comillas triples que puedan quedar
        cleaned = cleaned.replaceAll("```", "");

        // Remover texto explicativo común antes del JSON
        cleaned = cleaned.replaceAll("(?i).*?(?=\\[|\\{)", "");

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

        System.out.println("🧹 [ChatGPTService.cleanJsonResponse] Limpieza completada");
        System.out.println("🧹 [ChatGPTService.cleanJsonResponse] Longitud original: " + response.length());
        System.out.println("🧹 [ChatGPTService.cleanJsonResponse] Longitud limpia: " + cleaned.length());
        System.out.println("🧹 [ChatGPTService.cleanJsonResponse] Primeros 100 chars: "
                + cleaned.substring(0, Math.min(100, cleaned.length())));

        return cleaned;
    }

    /**
     * Enriquece las recomendaciones generadas con información adicional de libros.
     * 
     * @param recommendations Las recomendaciones generadas por ChatGPT
     * @return Lista de recomendaciones enriquecidas
     */
    private List<GeneratedRecommendationDTO> enrichRecommendations(List<GeneratedRecommendationDTO> recommendations) {
        System.out.println("📚 [ChatGPTService.enrichRecommendations] Iniciando enriquecimiento...");
        List<GeneratedRecommendationDTO> enrichedRecommendations = new ArrayList<>();

        for (GeneratedRecommendationDTO rec : recommendations) {
            System.out.println("📖 [ChatGPTService.enrichRecommendations] Procesando: " + rec.getTitle());

            try {
                // Intentar encontrar el libro usando el método existente findRecommendedBook
                // Este método busca en BD local primero, luego en Google Books
                Book book = bookService.findRecommendedBook(rec.getTitle());

                if (book != null) {
                    System.out.println("📖 [ChatGPTService.enrichRecommendations] Libro encontrado:");
                    System.out.println("📖 [ChatGPTService.enrichRecommendations] - ID: " + book.getId());
                    System.out.println("📖 [ChatGPTService.enrichRecommendations] - Título: " + book.getTitle());
                    System.out.println("📖 [ChatGPTService.enrichRecommendations] - ISBN13: " + book.getIsbn13());
                    System.out.println("📖 [ChatGPTService.enrichRecommendations] - Cover URL: " + book.getCoverUrl());
                    System.out.println("📖 [ChatGPTService.enrichRecommendations] - Publisher: " + book.getPublisher());
                    System.out.println("📖 [ChatGPTService.enrichRecommendations] - Pages: " + book.getPages());
                    System.out.println("📖 [ChatGPTService.enrichRecommendations] - Authors: "
                            + (book.getAuthors() != null ? book.getAuthors().size() : 0));

                    // Convertir autores a lista de strings
                    List<String> authorNames = new ArrayList<>();
                    if (book.getAuthors() != null && !book.getAuthors().isEmpty()) {
                        authorNames = book.getAuthors().stream()
                                .map(Author::getName)
                                .collect(Collectors.toList());
                    }

                    GeneratedRecommendationDTO enrichedRec = GeneratedRecommendationDTO.builder()
                            .title(book.getTitle())
                            .reason(rec.getReason())
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

                    enrichedRecommendations.add(enrichedRec);
                    System.out
                            .println("✅ [ChatGPTService.enrichRecommendations] Recomendación enriquecida exitosamente");

                } else {
                    System.out.println("❌ [ChatGPTService.enrichRecommendations] No se encontró información del libro");
                    // Crear recomendación básica sin enriquecer
                    GeneratedRecommendationDTO basicRec = GeneratedRecommendationDTO.builder()
                            .title(rec.getTitle())
                            .reason(rec.getReason())
                            .coverUrl(null)
                            .enriched(false)
                            .build();
                    enrichedRecommendations.add(basicRec);
                }

            } catch (Exception e) {
                System.err.println("💥 [ChatGPTService.enrichRecommendations] Error al enriquecer: " + rec.getTitle());
                System.err.println("💥 [ChatGPTService.enrichRecommendations] Tipo: " + e.getClass().getSimpleName());
                System.err.println("💥 [ChatGPTService.enrichRecommendations] Mensaje: " + e.getMessage());

                // En caso de error, crear recomendación básica
                GeneratedRecommendationDTO basicRec = GeneratedRecommendationDTO.builder()
                        .title(rec.getTitle())
                        .reason(rec.getReason())
                        .coverUrl(null)
                        .enriched(false)
                        .build();
                enrichedRecommendations.add(basicRec);
            }
        }

        System.out.println("📚 [ChatGPTService.enrichRecommendations] Enriquecimiento completado");
        System.out.println(
                "📚 [ChatGPTService.enrichRecommendations] Total recomendaciones: " + enrichedRecommendations.size());
        System.out.println("📚 [ChatGPTService.enrichRecommendations] Enriquecidas: "
                + enrichedRecommendations.stream().mapToLong(r -> r.isEnriched() ? 1 : 0).sum());

        return enrichedRecommendations;
    }

    /**
     * Formatea el ritmo de lectura para el prompt.
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