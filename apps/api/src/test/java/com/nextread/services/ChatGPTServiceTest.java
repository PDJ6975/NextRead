package com.nextread.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.ArrayList;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nextread.dto.GeneratedRecommendationDTO;
import com.nextread.entities.GenreSelection;
import com.nextread.entities.PaceSelection;
import com.nextread.entities.ReadingStatus;
import com.nextread.entities.Survey;
import com.nextread.entities.User;
import com.nextread.entities.UserBook;
import com.nextread.entities.Book;
import com.nextread.entities.Genre;

@ExtendWith(MockitoExtension.class)
public class ChatGPTServiceTest {

    @Mock
    private SurveyService surveyService;

    @Mock
    private UserBookService userBookService;

    @Mock
    private BookService bookService;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private ChatGPTService chatGPTService;

    private ObjectMapper objectMapper = new ObjectMapper();

    private User testUser;
    private Survey testSurvey;
    private Genre testGenre;
    private Book testBook;
    private UserBook testUserBook;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setNickname("testuser");

        testGenre = new Genre();
        testGenre.setId(1L);
        testGenre.setSelectedGenre(GenreSelection.FANTASY);

        testBook = Book.builder()
                .id(1L)
                .title("Test Book")
                .isbn10("1234567890")
                .isbn13("1234567890123")
                .publisher("Test Publisher")
                .coverUrl("https://example.com/cover.jpg")
                .synopsis("Test synopsis")
                .pages(200)
                .publishedYear("2023")
                .build();

        testUserBook = UserBook.builder()
                .id(1L)
                .user(testUser)
                .book(testBook)
                .rating(4.5f)
                .status(ReadingStatus.READ)
                .build();

        testSurvey = Survey.builder()
                .id(1L)
                .user(testUser)
                .pace(PaceSelection.FAST)
                .selectedGenres(List.of(testGenre))
                .firstTime(false)
                .build();

        // Set up API key for testing
        ReflectionTestUtils.setField(chatGPTService, "apiKey", "test-api-key");
        ReflectionTestUtils.setField(chatGPTService, "apiUrl", "https://api.openai.com/v1/chat/completions");
        ReflectionTestUtils.setField(chatGPTService, "objectMapper", objectMapper);
    }

    @Nested
    @DisplayName("Generate Recommendations Tests")
    class GenerateRecommendationsTests {

        @Test
        @DisplayName("Should throw exception when user has not completed first survey")
        void shouldThrowExceptionWhenUserHasNotCompletedFirstSurvey() {
            // Given
            Survey firstTimeSurvey = Survey.builder()
                    .id(1L)
                    .user(testUser)
                    .pace(PaceSelection.FAST)
                    .selectedGenres(List.of(testGenre))
                    .firstTime(true)
                    .build();

            when(surveyService.findSurveyByUser(testUser)).thenReturn(firstTimeSurvey);

            // When & Then
            RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                chatGPTService.generateRecommendations(testUser, new ArrayList<>());
            });

            assertEquals(
                    "Error al generar recomendaciones: Se debe completar la encuesta base para poder comenzar con las recomendaciones.",
                    exception.getMessage());
            verify(surveyService).findSurveyByUser(testUser);
            verify(userBookService, never()).findUserBooks(any());
        }

        @Test
        @DisplayName("Should throw exception when API key is not configured")
        void shouldThrowExceptionWhenApiKeyNotConfigured() {
            // Given
            ReflectionTestUtils.setField(chatGPTService, "apiKey", "");

            // When & Then
            RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                chatGPTService.generateRecommendations(testUser, new ArrayList<>());
            });

            assertEquals("API key de OpenAI no configurada", exception.getMessage());
            verify(surveyService, never()).findSurveyByUser(any());
        }

        @Test
        @DisplayName("Should throw exception when API key is null")
        void shouldThrowExceptionWhenApiKeyIsNull() {
            // Given
            ReflectionTestUtils.setField(chatGPTService, "apiKey", null);

            // When & Then
            RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                chatGPTService.generateRecommendations(testUser, new ArrayList<>());
            });

            assertEquals("API key de OpenAI no configurada", exception.getMessage());
            verify(surveyService, never()).findSurveyByUser(any());
        }

        @Test
        @DisplayName("Should successfully generate recommendations with valid data")
        void shouldSuccessfullyGenerateRecommendationsWithValidData() throws Exception {
            // Given
            when(surveyService.findSurveyByUser(testUser)).thenReturn(testSurvey);
            when(userBookService.findUserBooks(testUser)).thenReturn(List.of(testUserBook));

            // Crear respuesta con 3 recomendaciones como espera el algoritmo
            String mockApiResponse = """
                    {
                        "choices": [{
                            "message": {
                                "content": "[{\\"title\\": \\"The Hobbit\\", \\"reason\\": \\"Perfect fantasy book for fast readers\\"}, {\\"title\\": \\"Dune\\", \\"reason\\": \\"Epic science fiction\\"}, {\\"title\\": \\"1984\\", \\"reason\\": \\"Classic dystopian novel\\"}]"
                            }
                        }]
                    }
                    """;

            ResponseEntity<String> mockResponse = ResponseEntity.ok(mockApiResponse);
            when(restTemplate.exchange(anyString(), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class)))
                    .thenReturn(mockResponse);

            // Mock diferentes libros para las 3 recomendaciones
            Book book1 = Book.builder()
                    .id(1L)
                    .title("The Hobbit")
                    .isbn10("1234567890")
                    .isbn13("1234567890123")
                    .publisher("Test Publisher")
                    .coverUrl("https://example.com/hobbit.jpg")
                    .synopsis("A fantasy adventure")
                    .pages(300)
                    .publishedYear("1937")
                    .build();

            Book book2 = Book.builder()
                    .id(2L)
                    .title("Dune")
                    .isbn10("1234567891")
                    .isbn13("1234567890124")
                    .publisher("Test Publisher")
                    .coverUrl("https://example.com/dune.jpg")
                    .synopsis("A science fiction epic")
                    .pages(500)
                    .publishedYear("1965")
                    .build();

            Book book3 = Book.builder()
                    .id(3L)
                    .title("1984")
                    .isbn10("1234567892")
                    .isbn13("1234567890125")
                    .publisher("Test Publisher")
                    .coverUrl("https://example.com/1984.jpg")
                    .synopsis("A dystopian classic")
                    .pages(250)
                    .publishedYear("1949")
                    .build();

            when(bookService.findRecommendedBook("The Hobbit")).thenReturn(book1);
            when(bookService.findRecommendedBook("Dune")).thenReturn(book2);
            when(bookService.findRecommendedBook("1984")).thenReturn(book3);

            // When
            List<GeneratedRecommendationDTO> result = chatGPTService.generateRecommendations(testUser,
                    new ArrayList<>());

            // Then
            assertNotNull(result);
            assertEquals(3, result.size());
            assertEquals("The Hobbit", result.get(0).getTitle());
            assertEquals("Perfect fantasy book for fast readers", result.get(0).getReason());
            assertEquals("Dune", result.get(1).getTitle());
            assertEquals("Epic science fiction", result.get(1).getReason());
            assertEquals("1984", result.get(2).getTitle());
            assertEquals("Classic dystopian novel", result.get(2).getReason());

            verify(surveyService).findSurveyByUser(testUser);
            verify(userBookService).findUserBooks(testUser);
            verify(restTemplate).exchange(anyString(), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class));
        }

        @Test
        @DisplayName("Should handle empty user books list")
        void shouldHandleEmptyUserBooksList() {
            // Given
            when(surveyService.findSurveyByUser(testUser)).thenReturn(testSurvey);
            when(userBookService.findUserBooks(testUser)).thenReturn(new ArrayList<>());

            String mockApiResponse = """
                    {
                        "choices": [{
                            "message": {
                                "content": "[{\\"title\\": \\"Book 1\\", \\"reason\\": \\"Reason 1\\"}]"
                            }
                        }]
                    }
                    """;

            ResponseEntity<String> mockResponse = ResponseEntity.ok(mockApiResponse);
            when(restTemplate.exchange(anyString(), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class)))
                    .thenReturn(mockResponse);

            // When & Then - Should not throw exception
            assertDoesNotThrow(() -> {
                chatGPTService.generateRecommendations(testUser, new ArrayList<>());
            });

            verify(surveyService).findSurveyByUser(testUser);
            verify(userBookService).findUserBooks(testUser);
        }

        @Test
        @DisplayName("Should handle different reading statuses in user books")
        void shouldHandleDifferentReadingStatusesInUserBooks() {
            // Given
            UserBook abandonedBook = UserBook.builder()
                    .id(2L)
                    .user(testUser)
                    .book(Book.builder().title("Abandoned Book").build())
                    .status(ReadingStatus.ABANDONED)
                    .build();

            UserBook toReadBook = UserBook.builder()
                    .id(3L)
                    .user(testUser)
                    .book(Book.builder().title("To Read Book").build())
                    .status(ReadingStatus.TO_READ)
                    .rating(3.0f)
                    .build();

            when(surveyService.findSurveyByUser(testUser)).thenReturn(testSurvey);
            when(userBookService.findUserBooks(testUser)).thenReturn(List.of(testUserBook, abandonedBook, toReadBook));

            String mockApiResponse = """
                    {
                        "choices": [{
                            "message": {
                                "content": "[{\\"title\\": \\"Book 1\\", \\"reason\\": \\"Reason 1\\"}]"
                            }
                        }]
                    }
                    """;

            ResponseEntity<String> mockResponse = ResponseEntity.ok(mockApiResponse);
            when(restTemplate.exchange(anyString(), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class)))
                    .thenReturn(mockResponse);

            // When & Then
            assertDoesNotThrow(() -> {
                chatGPTService.generateRecommendations(testUser, new ArrayList<>());
            });

            verify(surveyService).findSurveyByUser(testUser);
            verify(userBookService).findUserBooks(testUser);
        }

        @Test
        @DisplayName("Should handle RestTemplate exceptions")
        void shouldHandleRestTemplateExceptions() {
            // Given
            when(surveyService.findSurveyByUser(testUser)).thenReturn(testSurvey);
            when(userBookService.findUserBooks(testUser)).thenReturn(List.of());
            when(restTemplate.exchange(anyString(), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class)))
                    .thenThrow(new RuntimeException("Network error"));

            // When & Then
            RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                chatGPTService.generateRecommendations(testUser, new ArrayList<>());
            });

            assertTrue(exception.getMessage().contains("Error al generar recomendaciones"));
            verify(surveyService).findSurveyByUser(testUser);
            verify(userBookService).findUserBooks(testUser);
        }

        @Test
        @DisplayName("Should validate survey firstTime flag correctly")
        void shouldValidateSurveyFirstTimeFlagCorrectly() {
            // Given - Survey with firstTime = false (should proceed)
            Survey completedSurvey = Survey.builder()
                    .id(1L)
                    .user(testUser)
                    .pace(PaceSelection.SLOW)
                    .selectedGenres(List.of(testGenre))
                    .firstTime(false)
                    .build();

            when(surveyService.findSurveyByUser(testUser)).thenReturn(completedSurvey);
            when(userBookService.findUserBooks(testUser)).thenReturn(List.of());

            // When & Then - Should not throw the "first time" exception
            RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                chatGPTService.generateRecommendations(testUser, new ArrayList<>());
            });

            // Should throw a different exception (not the first time validation)
            assertNotEquals(
                    "Error al generar recomendaciones: Se debe completar la encuesta base para poder comenzar con las recomendaciones.",
                    exception.getMessage());
            verify(surveyService).findSurveyByUser(testUser);
            verify(userBookService).findUserBooks(testUser);
        }
    }

    @Nested
    @DisplayName("Format Methods Tests")
    class FormatMethodsTests {

        @Test
        @DisplayName("Should format FAST pace correctly")
        void shouldFormatFastPaceCorrectly() {
            // Given
            PaceSelection pace = PaceSelection.FAST;

            // When
            String result = (String) ReflectionTestUtils.invokeMethod(chatGPTService, "formatPace", pace);

            // Then
            assertNotNull(result);
            assertTrue(result.contains("Rápido"));
            assertTrue(result.contains("dinámicos"));
        }

        @SuppressWarnings("null")
        @Test
        @DisplayName("Should format SLOW pace correctly")
        void shouldFormatSlowPaceCorrectly() {
            // Given
            PaceSelection pace = PaceSelection.SLOW;

            // When
            String result = (String) ReflectionTestUtils.invokeMethod(chatGPTService, "formatPace", pace);

            // Then
            assertTrue(result.contains("Lento"));
            assertTrue(result.contains("tranquilamente"));
        }

        @Test
        @DisplayName("Should format FANTASY genre correctly")
        void shouldFormatFantasyGenreCorrectly() {
            // Given
            GenreSelection genre = GenreSelection.FANTASY;

            // When
            String result = (String) ReflectionTestUtils.invokeMethod(chatGPTService, "formatGenre", genre);

            // Then
            assertEquals("Fantasía", result);
        }

        @Test
        @DisplayName("Should format SCIENCE_FICTION genre correctly")
        void shouldFormatScienceFictionGenreCorrectly() {
            // Given
            GenreSelection genre = GenreSelection.SCIENCE_FICTION;

            // When
            String result = (String) ReflectionTestUtils.invokeMethod(chatGPTService, "formatGenre", genre);

            // Then
            assertEquals("Ciencia Ficción", result);
        }

        @Test
        @DisplayName("Should format ROMANCE genre correctly")
        void shouldFormatRomanceGenreCorrectly() {
            // Given
            GenreSelection genre = GenreSelection.ROMANCE;

            // When
            String result = (String) ReflectionTestUtils.invokeMethod(chatGPTService, "formatGenre", genre);

            // Then
            assertEquals("Romance", result);
        }

        @Test
        @DisplayName("Should format THRILLER genre correctly")
        void shouldFormatThrillerGenreCorrectly() {
            // Given
            GenreSelection genre = GenreSelection.THRILLER;

            // When
            String result = (String) ReflectionTestUtils.invokeMethod(chatGPTService, "formatGenre", genre);

            // Then
            assertEquals("Thriller", result);
        }

        @Test
        @DisplayName("Should format MYSTERY genre correctly")
        void shouldFormatMysteryGenreCorrectly() {
            // Given
            GenreSelection genre = GenreSelection.MYSTERY;

            // When
            String result = (String) ReflectionTestUtils.invokeMethod(chatGPTService, "formatGenre", genre);

            // Then
            assertEquals("Misterio", result);
        }

        @Test
        @DisplayName("Should format HORROR genre correctly")
        void shouldFormatHorrorGenreCorrectly() {
            // Given
            GenreSelection genre = GenreSelection.HORROR;

            // When
            String result = (String) ReflectionTestUtils.invokeMethod(chatGPTService, "formatGenre", genre);

            // Then
            assertEquals("Terror", result);
        }

        @Test
        @DisplayName("Should format NON_FICTION genre correctly")
        void shouldFormatNonFictionGenreCorrectly() {
            // Given
            GenreSelection genre = GenreSelection.NON_FICTION;

            // When
            String result = (String) ReflectionTestUtils.invokeMethod(chatGPTService, "formatGenre", genre);

            // Then
            assertEquals("No Ficción", result);
        }

        @Test
        @DisplayName("Should format YOUNG_ADULT genre correctly")
        void shouldFormatYoungAdultGenreCorrectly() {
            // Given
            GenreSelection genre = GenreSelection.YOUNG_ADULT;

            // When
            String result = (String) ReflectionTestUtils.invokeMethod(chatGPTService, "formatGenre", genre);

            // Then
            assertEquals("Juvenil", result);
        }
    }

    @Nested
    @DisplayName("Prompt Building Tests")
    class PromptBuildingTests {

        @Test
        @DisplayName("Should build prompt with survey data and no user books")
        void shouldBuildPromptWithSurveyDataAndNoUserBooks() {
            // Given
            Survey survey = Survey.builder()
                    .pace(PaceSelection.FAST)
                    .selectedGenres(List.of(testGenre))
                    .build();

            // When
            String prompt = (String) ReflectionTestUtils.invokeMethod(chatGPTService, "buildPrompt", survey,
                    new ArrayList<UserBook>(), new ArrayList<Book>());

            // Then
            assertNotNull(prompt);
            assertTrue(prompt.contains("Rápido"));
            assertTrue(prompt.contains("Fantasía"));
            assertTrue(prompt.contains("JSON válido"));
            assertTrue(prompt.contains("exactamente 3 libros"));
        }

        @Test
        @DisplayName("Should build prompt with user books history")
        void shouldBuildPromptWithUserBooksHistory() {
            // Given
            Survey survey = Survey.builder()
                    .pace(PaceSelection.SLOW)
                    .selectedGenres(List.of(testGenre))
                    .build();

            List<UserBook> userBooks = List.of(testUserBook);

            // When
            String prompt = (String) ReflectionTestUtils.invokeMethod(chatGPTService, "buildPrompt", survey, userBooks,
                    new ArrayList<Book>());

            // Then
            assertNotNull(prompt);
            assertTrue(prompt.contains("Historial de libros"));
            assertTrue(prompt.contains("Test Book"));
            assertTrue(prompt.contains("LEÍDO COMPLETAMENTE"));
            assertTrue(prompt.contains("Valoración: 4.5/5"));
        }

        @Test
        @DisplayName("Should build prompt with abandoned books")
        void shouldBuildPromptWithAbandonedBooks() {
            // Given
            UserBook abandonedBook = UserBook.builder()
                    .user(testUser)
                    .book(Book.builder().title("Abandoned Book").build())
                    .status(ReadingStatus.ABANDONED)
                    .build();

            List<UserBook> userBooks = List.of(abandonedBook);

            // When
            String prompt = (String) ReflectionTestUtils.invokeMethod(chatGPTService, "buildPrompt", testSurvey,
                    userBooks, new ArrayList<Book>());

            // Then
            assertNotNull(prompt);
            assertTrue(prompt.contains("NO TERMINADO"));
            assertTrue(prompt.contains("abandonó"));
            assertTrue(prompt.contains("NO le gustaron"));
        }

        @Test
        @DisplayName("Should build prompt with multiple genres")
        void shouldBuildPromptWithMultipleGenres() {
            // Given
            Genre genre1 = new Genre();
            genre1.setSelectedGenre(GenreSelection.FANTASY);
            Genre genre2 = new Genre();
            genre2.setSelectedGenre(GenreSelection.SCIENCE_FICTION);

            Survey survey = Survey.builder()
                    .pace(PaceSelection.FAST)
                    .selectedGenres(List.of(genre1, genre2))
                    .build();

            // When
            String prompt = (String) ReflectionTestUtils.invokeMethod(chatGPTService, "buildPrompt", survey,
                    new ArrayList<UserBook>(), new ArrayList<Book>());

            // Then
            assertNotNull(prompt);
            assertTrue(prompt.contains("Fantasía"));
            assertTrue(prompt.contains("Ciencia Ficción"));
        }

        @Test
        @DisplayName("Should build prompt with rejected books")
        void shouldBuildPromptWithRejectedBooks() {
            // Given
            Survey survey = Survey.builder()
                    .pace(PaceSelection.FAST)
                    .selectedGenres(List.of(testGenre))
                    .build();

            List<UserBook> userBooks = new ArrayList<>();
            List<Book> rejectedBooks = List.of(
                    Book.builder().title("Rejected Book 1").build(),
                    Book.builder().title("Rejected Book 2").build());

            // When
            String prompt = (String) ReflectionTestUtils.invokeMethod(chatGPTService, "buildPrompt", survey, userBooks,
                    rejectedBooks);

            // Then
            assertNotNull(prompt);
            assertTrue(prompt.contains("Libros rechazados recientemente"));
            assertTrue(prompt.contains("Rejected Book 1"));
            assertTrue(prompt.contains("Rejected Book 2"));
            assertTrue(prompt.contains("Evita recomendar libros similares a estos"));
        }

        @Test
        @DisplayName("Should build prompt without rejected books when list is empty")
        void shouldBuildPromptWithoutRejectedBooksWhenListIsEmpty() {
            // Given
            Survey survey = Survey.builder()
                    .pace(PaceSelection.FAST)
                    .selectedGenres(List.of(testGenre))
                    .build();

            List<UserBook> userBooks = new ArrayList<>();
            List<Book> rejectedBooks = new ArrayList<>();

            // When
            String prompt = (String) ReflectionTestUtils.invokeMethod(chatGPTService, "buildPrompt", survey, userBooks,
                    rejectedBooks);

            // Then
            assertNotNull(prompt);
            assertFalse(prompt.contains("Libros rechazados recientemente"));
            assertFalse(prompt.contains("Evita recomendar libros similares a estos"));
        }
    }

    @Nested
    @DisplayName("Response Parsing Tests")
    class ResponseParsingTests {

        @Test
        @DisplayName("Should parse valid JSON recommendations")
        void shouldParseValidJsonRecommendations() {
            // Given
            String jsonResponse = """
                    [
                        {
                            "title": "The Hobbit",
                            "reason": "Perfect fantasy adventure"
                        },
                        {
                            "title": "Dune",
                            "reason": "Epic science fiction"
                        }
                    ]
                    """;

            // When
            @SuppressWarnings("unchecked")
            List<GeneratedRecommendationDTO> result = (List<GeneratedRecommendationDTO>) ReflectionTestUtils
                    .invokeMethod(
                            chatGPTService, "parseRecommendations", jsonResponse);

            // Then
            assertNotNull(result);
            assertEquals(2, result.size());
            assertEquals("The Hobbit", result.get(0).getTitle());
            assertEquals("Perfect fantasy adventure", result.get(0).getReason());
            assertEquals("Dune", result.get(1).getTitle());
            assertEquals("Epic science fiction", result.get(1).getReason());
        }

        @Test
        @DisplayName("Should handle empty JSON array")
        void shouldHandleEmptyJsonArray() {
            // Given
            String jsonResponse = "[]";

            // When & Then
            RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                ReflectionTestUtils.invokeMethod(chatGPTService, "parseRecommendations", jsonResponse);
            });

            assertTrue(exception.getMessage().contains("No se pudieron generar recomendaciones válidas"));
        }

        @Test
        @DisplayName("Should throw exception for invalid JSON")
        void shouldThrowExceptionForInvalidJson() {
            // Given
            String invalidJson = "invalid json";

            // When & Then
            RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                ReflectionTestUtils.invokeMethod(chatGPTService, "parseRecommendations", invalidJson);
            });

            assertTrue(exception.getMessage().contains("Error al parsear recomendaciones"));
        }

        @Test
        @DisplayName("Should extract content from ChatGPT response")
        void shouldExtractContentFromChatGPTResponse() {
            // Given
            String apiResponse = """
                    {
                        "choices": [{
                            "message": {
                                "content": "This is the content"
                            }
                        }]
                    }
                    """;

            // When
            String result = (String) ReflectionTestUtils.invokeMethod(chatGPTService, "extractContentFromResponse",
                    apiResponse);

            // Then
            assertEquals("This is the content", result);
        }

        @Test
        @DisplayName("Should throw exception for invalid API response")
        void shouldThrowExceptionForInvalidApiResponse() {
            // Given
            String invalidResponse = "invalid response";

            // When & Then
            RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                ReflectionTestUtils.invokeMethod(chatGPTService, "extractContentFromResponse", invalidResponse);
            });

            assertTrue(exception.getMessage().contains("Error al parsear respuesta de ChatGPT"));
        }
    }
}