package com.nextread.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import com.nextread.entities.GenreSelection;
import com.nextread.entities.PaceSelection;
import com.nextread.entities.Survey;
import com.nextread.entities.User;
import com.nextread.entities.Genre;

@ExtendWith(MockitoExtension.class)
public class ChatGPTServiceTest {

    @Mock
    private SurveyService surveyService;

    @Mock
    private UserBookService userBookService;

    @InjectMocks
    private ChatGPTService chatGPTService;

    private User testUser;
    private Survey testSurvey;
    private Genre testGenre;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setNickname("testuser");

        testGenre = new Genre();
        testGenre.setId(1L);
        testGenre.setSelectedGenre(GenreSelection.FANTASY);

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
                chatGPTService.generateRecommendations(testUser);
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
                chatGPTService.generateRecommendations(testUser);
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
                chatGPTService.generateRecommendations(testUser);
            });

            assertEquals("API key de OpenAI no configurada", exception.getMessage());
            verify(surveyService, never()).findSurveyByUser(any());
        }

        @Test
        @DisplayName("Should call survey service when conditions are met")
        void shouldCallSurveyServiceWhenConditionsAreMet() {
            // Given
            when(surveyService.findSurveyByUser(testUser)).thenReturn(testSurvey);
            when(userBookService.findUserBooks(testUser)).thenReturn(List.of());

            // When & Then - Expect exception due to missing RestTemplate mocking
            assertThrows(RuntimeException.class, () -> {
                chatGPTService.generateRecommendations(testUser);
            });

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
                chatGPTService.generateRecommendations(testUser);
            });

            // Should throw a different exception (not the first time validation)
            assertNotEquals(
                    "Error al generar recomendaciones: Se debe completar la encuesta base para poder comenzar con las recomendaciones.",
                    exception.getMessage());
            verify(surveyService).findSurveyByUser(testUser);
            verify(userBookService).findUserBooks(testUser);
        }
    }
}