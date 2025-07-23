package com.nextread.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.nextread.dto.GeneratedRecommendationDTO;
import com.nextread.entities.Book;
import com.nextread.entities.Recommendation;
import com.nextread.entities.User;
import com.nextread.repositories.BookRepository;
import com.nextread.repositories.RecommendationRepository;
import com.nextread.entities.RecommendationStatus;

@ExtendWith(MockitoExtension.class)
public class RecommendationServiceTest {

    @Mock
    private RecommendationRepository recommendationRepository;

    @Mock
    private BookRepository bookRepository;

    @Mock
    private BookService bookService;

    @Mock
    private ChatGPTService chatGPTService;

    @InjectMocks
    private RecommendationService recommendationService;

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
    }

    @Nested
    @DisplayName("Generate Recommendations Tests")
    class GenerateRecommendationsTests {

        @Test
        @DisplayName("Should generate recommendations successfully")
        void shouldGenerateRecommendationsSuccessfully() {
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

            when(chatGPTService.generateRecommendations(eq(testUser), any())).thenReturn(expectedRecommendations);

            // When
            List<GeneratedRecommendationDTO> result = recommendationService.generateRecommendations(testUser);

            // Then
            assertEquals(expectedRecommendations.size(), result.size());
            assertEquals(expectedRecommendations.get(0).getTitle(), result.get(0).getTitle());
            assertEquals(expectedRecommendations.get(0).getReason(), result.get(0).getReason());
            verify(chatGPTService).generateRecommendations(eq(testUser), any());
        }

        @Test
        @DisplayName("Should throw exception when ChatGPT service fails")
        void shouldThrowExceptionWhenChatGPTServiceFails() {
            // Given
            when(chatGPTService.generateRecommendations(eq(testUser), any()))
                    .thenThrow(new RuntimeException("ChatGPT API error"));

            // When & Then
            RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                recommendationService.generateRecommendations(testUser);
            });

            assertEquals("ChatGPT API error", exception.getMessage());
            verify(chatGPTService).generateRecommendations(eq(testUser), any());
        }
    }

    @Nested
    @DisplayName("Get Recommendations Tests")
    class GetRecommendationsTests {

        @Test
        @DisplayName("Should return user recommendations")
        void shouldReturnUserRecommendations() {
            // Given
            List<Recommendation> expectedRecommendations = List.of(testRecommendation);
            when(recommendationRepository.findByRecommendedUserAndStatus(testUser, RecommendationStatus.REJECTED))
                    .thenReturn(expectedRecommendations);

            // When
            List<Recommendation> result = recommendationService.getRecommendationsForUser(testUser);

            // Then
            assertEquals(expectedRecommendations.size(), result.size());
            assertEquals(testRecommendation.getId(), result.get(0).getId());
            verify(recommendationRepository).findByRecommendedUserAndStatus(testUser, RecommendationStatus.REJECTED);
        }

        @Test
        @DisplayName("Should return empty list when no recommendations")
        void shouldReturnEmptyListWhenNoRecommendations() {
            // Given
            when(recommendationRepository.findByRecommendedUserAndStatus(testUser, RecommendationStatus.REJECTED))
                    .thenReturn(new ArrayList<>());

            // When
            List<Recommendation> result = recommendationService.getRecommendationsForUser(testUser);

            // Then
            assertTrue(result.isEmpty());
            verify(recommendationRepository).findByRecommendedUserAndStatus(testUser, RecommendationStatus.REJECTED);
        }
    }

    @Nested
    @DisplayName("Create Recommendation Tests")
    class CreateRecommendationTests {

        @Test
        @DisplayName("Should create recommendation successfully")
        void shouldCreateRecommendationSuccessfully() {
            // Given
            String reason = "Great book for fantasy lovers";
            when(bookService.findBookById(1L)).thenReturn(testBook);
            when(recommendationRepository.findByRecommendedUser(testUser)).thenReturn(new ArrayList<>());
            when(recommendationRepository.save(any(Recommendation.class))).thenReturn(testRecommendation);

            // When
            Recommendation result = recommendationService.createRecommendation(testUser, 1L, reason);

            // Then
            assertNotNull(result);
            assertEquals(testRecommendation.getId(), result.getId());
            verify(bookService).findBookById(1L);
            verify(recommendationRepository).findByRecommendedUser(testUser);
            verify(recommendationRepository).save(any(Recommendation.class));
        }

        @Test
        @DisplayName("Should throw exception when book not found")
        void shouldThrowExceptionWhenBookNotFound() {
            // Given
            when(bookService.findBookById(1L)).thenReturn(null);

            // When & Then
            RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                recommendationService.createRecommendation(testUser, 1L, "Test reason");
            });

            assertEquals("Libro no encontrado", exception.getMessage());
            verify(bookService).findBookById(1L);
            verify(recommendationRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should throw exception when recommendation already exists")
        void shouldThrowExceptionWhenRecommendationAlreadyExists() {
            // Given
            when(bookService.findBookById(1L)).thenReturn(testBook);
            when(recommendationRepository.findByRecommendedUser(testUser)).thenReturn(List.of(testRecommendation));

            // When & Then
            RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                recommendationService.createRecommendation(testUser, 1L, "Test reason");
            });

            assertEquals("Ya existe una recomendación de este libro para el usuario", exception.getMessage());
            verify(bookService).findBookById(1L);
            verify(recommendationRepository).findByRecommendedUser(testUser);
            verify(recommendationRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("Delete Recommendation Tests")
    class DeleteRecommendationTests {

        @Test
        @DisplayName("Should delete recommendation successfully")
        void shouldDeleteRecommendationSuccessfully() {
            // Given
            when(recommendationRepository.findById(1L)).thenReturn(Optional.of(testRecommendation));

            // When
            recommendationService.deleteRecommendation(1L, testUser);

            // Then
            verify(recommendationRepository).findById(1L);
            verify(recommendationRepository).delete(testRecommendation);
        }

        @Test
        @DisplayName("Should throw exception when recommendation not found")
        void shouldThrowExceptionWhenRecommendationNotFound() {
            // Given
            when(recommendationRepository.findById(1L)).thenReturn(Optional.empty());

            // When & Then
            RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                recommendationService.deleteRecommendation(1L, testUser);
            });

            assertEquals("Recomendación no encontrada", exception.getMessage());
            verify(recommendationRepository).findById(1L);
            verify(recommendationRepository, never()).delete(any());
        }

        @Test
        @DisplayName("Should throw exception when user not authorized")
        void shouldThrowExceptionWhenUserNotAuthorized() {
            // Given
            User otherUser = new User();
            otherUser.setId(2L);
            otherUser.setEmail("other@example.com");

            when(recommendationRepository.findById(1L)).thenReturn(Optional.of(testRecommendation));

            // When & Then
            RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                recommendationService.deleteRecommendation(1L, otherUser);
            });

            assertEquals("No tienes permisos para eliminar esta recomendación", exception.getMessage());
            verify(recommendationRepository).findById(1L);
            verify(recommendationRepository, never()).delete(any());
        }
    }

    @Nested
    @DisplayName("Delete Recommendation By User And Book Tests")
    class DeleteRecommendationByUserAndBookTests {

        @Test
        @DisplayName("Should delete recommendation by user and book")
        void shouldDeleteRecommendationByUserAndBook() {
            // When
            recommendationService.deleteRecommendationByUserAndBook(testUser, testBook);

            // Then
            verify(recommendationRepository).deleteByRecommendedUserAndRecommendedBook(testUser, testBook);
        }
    }

    @Nested
    @DisplayName("Find Recommendation By Id Tests")
    class FindRecommendationByIdTests {

        @Test
        @DisplayName("Should find recommendation by id successfully")
        void shouldFindRecommendationByIdSuccessfully() {
            // Given
            when(recommendationRepository.findById(1L)).thenReturn(Optional.of(testRecommendation));

            // When
            Recommendation result = recommendationService.findRecommendationById(1L);

            // Then
            assertNotNull(result);
            assertEquals(testRecommendation.getId(), result.getId());
            verify(recommendationRepository).findById(1L);
        }

        @Test
        @DisplayName("Should throw exception when recommendation not found")
        void shouldThrowExceptionWhenRecommendationNotFound() {
            // Given
            when(recommendationRepository.findById(1L)).thenReturn(Optional.empty());

            // When & Then
            RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                recommendationService.findRecommendationById(1L);
            });

            assertEquals("Recomendación no encontrada", exception.getMessage());
            verify(recommendationRepository).findById(1L);
        }
    }

    @Nested
    @DisplayName("Get Recently Rejected Books Tests")
    class GetRecentlyRejectedBooksTests {

        @Test
        @DisplayName("Should return recently rejected books")
        void shouldReturnRecentlyRejectedBooks() {
            // Given
            Book rejectedBook1 = Book.builder().id(1L).title("Rejected Book 1").build();
            Book rejectedBook2 = Book.builder().id(2L).title("Rejected Book 2").build();

            Recommendation rejectedRec1 = new Recommendation();
            rejectedRec1.setRecommendedBook(rejectedBook1);

            Recommendation rejectedRec2 = new Recommendation();
            rejectedRec2.setRecommendedBook(rejectedBook2);

            List<Recommendation> rejectedRecommendations = List.of(rejectedRec1, rejectedRec2);

            when(recommendationRepository.findByRecommendedUserAndStatusAndCreatedAtAfter(
                    eq(testUser), eq(RecommendationStatus.REJECTED), any())).thenReturn(rejectedRecommendations);

            // When
            List<Book> result = recommendationService.getRecentlyRejectedBooks(testUser, 30);

            // Then
            assertEquals(2, result.size());
            assertEquals("Rejected Book 1", result.get(0).getTitle());
            assertEquals("Rejected Book 2", result.get(1).getTitle());
            verify(recommendationRepository).findByRecommendedUserAndStatusAndCreatedAtAfter(
                    eq(testUser), eq(RecommendationStatus.REJECTED), any());
        }

        @Test
        @DisplayName("Should return empty list when no recently rejected books")
        void shouldReturnEmptyListWhenNoRecentlyRejectedBooks() {
            // Given
            when(recommendationRepository.findByRecommendedUserAndStatusAndCreatedAtAfter(
                    eq(testUser), eq(RecommendationStatus.REJECTED), any())).thenReturn(new ArrayList<>());

            // When
            List<Book> result = recommendationService.getRecentlyRejectedBooks(testUser, 30);

            // Then
            assertTrue(result.isEmpty());
            verify(recommendationRepository).findByRecommendedUserAndStatusAndCreatedAtAfter(
                    eq(testUser), eq(RecommendationStatus.REJECTED), any());
        }

        @Test
        @DisplayName("Should return distinct books when multiple recommendations for same book")
        void shouldReturnDistinctBooksWhenMultipleRecommendationsForSameBook() {
            // Given
            Book rejectedBook = Book.builder().id(1L).title("Rejected Book").build();

            Recommendation rejectedRec1 = new Recommendation();
            rejectedRec1.setRecommendedBook(rejectedBook);

            Recommendation rejectedRec2 = new Recommendation();
            rejectedRec2.setRecommendedBook(rejectedBook); // Same book, different recommendation

            List<Recommendation> rejectedRecommendations = List.of(rejectedRec1, rejectedRec2);

            when(recommendationRepository.findByRecommendedUserAndStatusAndCreatedAtAfter(
                    eq(testUser), eq(RecommendationStatus.REJECTED), any())).thenReturn(rejectedRecommendations);

            // When
            List<Book> result = recommendationService.getRecentlyRejectedBooks(testUser, 30);

            // Then
            assertEquals(1, result.size()); // Should return only one instance of the book
            assertEquals("Rejected Book", result.get(0).getTitle());
            verify(recommendationRepository).findByRecommendedUserAndStatusAndCreatedAtAfter(
                    eq(testUser), eq(RecommendationStatus.REJECTED), any());
        }
    }
}