package com.nextread.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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

    @Autowired
    public ChatGPTService(RestTemplate restTemplate,
            ObjectMapper objectMapper,
            SurveyService surveyService,
            UserBookService userBookService) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.surveyService = surveyService;
        this.userBookService = userBookService;
    }

    /**
     * Genera recomendaciones de libros basadas en la encuesta del usuario
     * utilizando la API de ChatGPT.
     * 
     * @param user El usuario para quien generar recomendaciones
     * @return Lista de recomendaciones generadas
     */
    public List<GeneratedRecommendationDTO> generateRecommendations(User user) {
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

            // Construir prompt personalizado
            String prompt = buildPrompt(survey, userBooks);

            // Llamar a la API de ChatGPT
            String response = callChatGPTAPI(prompt);

            // Parsear la respuesta y convertir a DTOs
            return parseRecommendations(response);

        } catch (Exception e) {
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
        prompt.append("Es muy importante que el título sea exacto para poder encontrar el libro.");

        return prompt.toString();
    }

    /**
     * Realiza la llamada a la API de ChatGPT.
     */
    private String callChatGPTAPI(String prompt) {
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

        return extractContentFromResponse(response.getBody());
    }

    /**
     * Extrae el contenido de la respuesta de ChatGPT.
     */
    private String extractContentFromResponse(String response) {
        try {
            JsonNode root = objectMapper.readTree(response);
            return root.path("choices").get(0).path("message").path("content").asText();
        } catch (Exception e) {
            throw new RuntimeException("Error al parsear respuesta de ChatGPT: " + e.getMessage());
        }
    }

    /**
     * Parsea las recomendaciones de la respuesta JSON.
     */
    private List<GeneratedRecommendationDTO> parseRecommendations(String jsonResponse) {
        try {
            JsonNode recommendations = objectMapper.readTree(jsonResponse);
            List<GeneratedRecommendationDTO> result = new ArrayList<>();

            for (JsonNode recommendation : recommendations) {
                GeneratedRecommendationDTO dto = GeneratedRecommendationDTO.builder()
                        .title(recommendation.path("title").asText())
                        .reason(recommendation.path("reason").asText())
                        .build();
                result.add(dto);
            }

            return result;
        } catch (Exception e) {
            throw new RuntimeException("Error al parsear recomendaciones: " + e.getMessage());
        }
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