package com.nextread.controller;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nextread.dto.GeneratedRecommendationDTO;
import com.nextread.dto.RecommendationRequestDTO;
import com.nextread.entities.Book;
import com.nextread.entities.Recommendation;
import com.nextread.entities.User;
import com.nextread.services.RecommendationService;
import com.nextread.services.RateLimitService;

@ExtendWith(MockitoExtension.class)
public class RecommendationControllerTest {

    private MockMvc mockMvc;

    @Mock
    private RecommendationService recommendationService;

    @Mock
    private RateLimitService rateLimitService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private User testUser;
    private Book testBook;
    private Recommendation testRecommendation;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setNickname("testuser");

        testBook = Book.builder()
                .id(1L)
                .title("Test Book")
                .isbn13("9781234567890")
                .build();

        testRecommendation = new Recommendation();
        testRecommendation.setId(1L);
        testRecommendation.setRecommendedUser(testUser);
        testRecommendation.setRecommendedBook(testBook);
        testRecommendation.setReason("Test reason");

        // Configurar MockMvc y autenticación
        RecommendationController controller = new RecommendationController(recommendationService, rateLimitService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

        // Configurar contexto de seguridad
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(testUser, null, List.of()));
    }

    @Nested
    @DisplayName("Generate Recommendations Tests")
    class GenerateRecommendationsTests {

        @Test
        @DisplayName("Should generate recommendations successfully")
        void shouldGenerateRecommendationsSuccessfully() throws Exception {
            // Given
            List<GeneratedRecommendationDTO> expectedRecommendations = List.of(
                    GeneratedRecommendationDTO.builder()
                            .title("Book 1")
                            .reason("Reason 1")
                            .build(),
                    GeneratedRecommendationDTO.builder()
                            .title("Book 2")
                            .reason("Reason 2")
                            .build());

            when(rateLimitService.canMakeRequest(any(User.class))).thenReturn(true);
            when(recommendationService.generateRecommendations(any(User.class)))
                    .thenReturn(expectedRecommendations);

            // When & Then
            mockMvc.perform(post("/recommendations/generate")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(2))
                    .andExpect(jsonPath("$[0].title").value("Book 1"))
                    .andExpect(jsonPath("$[0].reason").value("Reason 1"))
                    .andExpect(jsonPath("$[1].title").value("Book 2"))
                    .andExpect(jsonPath("$[1].reason").value("Reason 2"));

            verify(rateLimitService).canMakeRequest(any(User.class));
            verify(rateLimitService).recordRequest(any(User.class));
            verify(recommendationService).generateRecommendations(any(User.class));
        }

        @Test
        @DisplayName("Should return 429 when rate limit exceeded")
        void shouldReturn429WhenRateLimitExceeded() throws Exception {
            // Given
            when(rateLimitService.canMakeRequest(any(User.class))).thenReturn(false);
            when(rateLimitService.getRemainingRequests(any(User.class))).thenReturn(0);

            // When & Then
            mockMvc.perform(post("/recommendations/generate")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isTooManyRequests())
                    .andExpect(jsonPath("$.error").value("Límite de recomendaciones diarias alcanzado"))
                    .andExpect(jsonPath("$.message").value("Has alcanzado el límite de recomendaciones para hoy. Inténtalo mañana."))
                    .andExpect(jsonPath("$.remainingRequests").value(0))
                    .andExpect(jsonPath("$.resetTime").value("24 horas"));

            verify(rateLimitService).canMakeRequest(any(User.class));
            verify(rateLimitService).getRemainingRequests(any(User.class));
            verify(rateLimitService, never()).recordRequest(any(User.class));
            verify(recommendationService, never()).generateRecommendations(any(User.class));
        }
    }

    @Nested
    @DisplayName("Get Recommendations Tests")
    class GetRecommendationsTests {

        @Test
        @DisplayName("Should get user recommendations successfully")
        void shouldGetUserRecommendationsSuccessfully() throws Exception {
            // Given
            List<Recommendation> expectedRecommendations = List.of(testRecommendation);
            when(recommendationService.getRecommendationsForUser(any(User.class)))
                    .thenReturn(expectedRecommendations);

            // When & Then
            mockMvc.perform(get("/recommendations")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(1))
                    .andExpect(jsonPath("$[0].id").value(1))
                    .andExpect(jsonPath("$[0].reason").value("Test reason"));

            verify(recommendationService).getRecommendationsForUser(any(User.class));
        }

        @Test
        @DisplayName("Should return empty list when no recommendations")
        void shouldReturnEmptyListWhenNoRecommendations() throws Exception {
            // Given
            when(recommendationService.getRecommendationsForUser(any(User.class)))
                    .thenReturn(List.of());

            // When & Then
            mockMvc.perform(get("/recommendations")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(0));

            verify(recommendationService).getRecommendationsForUser(any(User.class));
        }
    }

    @Nested
    @DisplayName("Create Recommendation Tests")
    class CreateRecommendationTests {

        @Test
        @DisplayName("Should create recommendation successfully")
        void shouldCreateRecommendationSuccessfully() throws Exception {
            // Given
            RecommendationRequestDTO request = RecommendationRequestDTO.builder()
                    .bookId(1L)
                    .reason("Great book for fantasy lovers")
                    .build();

            when(recommendationService.createRecommendation(any(User.class), eq(1L),
                    eq("Great book for fantasy lovers")))
                    .thenReturn(testRecommendation);

            // When & Then
            mockMvc.perform(post("/recommendations")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(1))
                    .andExpect(jsonPath("$.reason").value("Test reason"));

            verify(recommendationService).createRecommendation(any(User.class), eq(1L),
                    eq("Great book for fantasy lovers"));
        }

        @Test
        @DisplayName("Should call service with request data")
        void shouldCallServiceWithRequestData() throws Exception {
            // Given
            RecommendationRequestDTO request = RecommendationRequestDTO.builder()
                    .bookId(2L)
                    .reason("Excellent read")
                    .build();

            when(recommendationService.createRecommendation(any(User.class), eq(2L), eq("Excellent read")))
                    .thenReturn(testRecommendation);

            // When & Then
            mockMvc.perform(post("/recommendations")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk());

            verify(recommendationService).createRecommendation(any(User.class), eq(2L), eq("Excellent read"));
        }
    }

    @Nested
    @DisplayName("Delete Recommendation Tests")
    class DeleteRecommendationTests {

        @Test
        @DisplayName("Should delete recommendation successfully")
        void shouldDeleteRecommendationSuccessfully() throws Exception {
            // Given
            doNothing().when(recommendationService).deleteRecommendation(eq(1L), any(User.class));

            // When & Then
            mockMvc.perform(delete("/recommendations/1")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(content().string("Recomendación eliminada correctamente"));

            verify(recommendationService).deleteRecommendation(eq(1L), any(User.class));
        }

        @Test
        @DisplayName("Should call service with correct parameters")
        void shouldCallServiceWithCorrectParameters() throws Exception {
            // Given
            doNothing().when(recommendationService).deleteRecommendation(eq(5L), any(User.class));

            // When & Then
            mockMvc.perform(delete("/recommendations/5")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(content().string("Recomendación eliminada correctamente"));

            verify(recommendationService).deleteRecommendation(eq(5L), any(User.class));
        }
    }
}