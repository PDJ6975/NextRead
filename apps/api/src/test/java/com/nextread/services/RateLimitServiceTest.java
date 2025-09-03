package com.nextread.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import com.nextread.entities.RecommendationRequest;
import com.nextread.entities.User;
import com.nextread.repositories.RecommendationRequestRepository;

@ExtendWith(MockitoExtension.class)
public class RateLimitServiceTest {

    @Mock
    private RecommendationRequestRepository recommendationRequestRepository;

    @InjectMocks
    private RateLimitService rateLimitService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setNickname("testuser");
    }

    @Nested
    @DisplayName("Rate Limiting Disabled Tests")
    class RateLimitingDisabledTests {

        @BeforeEach
        void setUpDisabled() {
            ReflectionTestUtils.setField(rateLimitService, "rateLimitEnabled", false);
            ReflectionTestUtils.setField(rateLimitService, "maxRecommendationsPerDay", 3);
        }

        @Test
        @DisplayName("Should allow unlimited requests when rate limiting is disabled")
        void shouldAllowUnlimitedRequestsWhenDisabled() {
            boolean canMakeRequest = rateLimitService.canMakeRequest(testUser);
            
            assertTrue(canMakeRequest);
            verify(recommendationRequestRepository, never()).findByUserAndRequestDate(any(), any());
        }

        @Test
        @DisplayName("Should not record requests when rate limiting is disabled")
        void shouldNotRecordRequestsWhenDisabled() {
            rateLimitService.recordRequest(testUser);
            
            verify(recommendationRequestRepository, never()).save(any());
            verify(recommendationRequestRepository, never()).findByUserAndRequestDate(any(), any());
        }

        @Test
        @DisplayName("Should return max integer for remaining requests when disabled")
        void shouldReturnMaxIntegerForRemainingRequestsWhenDisabled() {
            int remainingRequests = rateLimitService.getRemainingRequests(testUser);
            
            assertEquals(Integer.MAX_VALUE, remainingRequests);
            verify(recommendationRequestRepository, never()).findByUserAndRequestDate(any(), any());
        }
    }

    @Nested
    @DisplayName("Rate Limiting Enabled Tests")
    class RateLimitingEnabledTests {

        @BeforeEach
        void setUpEnabled() {
            ReflectionTestUtils.setField(rateLimitService, "rateLimitEnabled", true);
            ReflectionTestUtils.setField(rateLimitService, "maxRecommendationsPerDay", 3);
        }

        @Test
        @DisplayName("Should allow request for new user")
        void shouldAllowRequestForNewUser() {
            when(recommendationRequestRepository.findByUserAndRequestDate(testUser, LocalDate.now()))
                    .thenReturn(Optional.empty());

            boolean canMakeRequest = rateLimitService.canMakeRequest(testUser);
            
            assertTrue(canMakeRequest);
            verify(recommendationRequestRepository).findByUserAndRequestDate(testUser, LocalDate.now());
        }

        @Test
        @DisplayName("Should allow request when under limit")
        void shouldAllowRequestWhenUnderLimit() {
            RecommendationRequest existingRequest = RecommendationRequest.builder()
                    .user(testUser)
                    .requestDate(LocalDate.now())
                    .requestCount(2)
                    .maxRequestsPerDay(3)
                    .build();

            when(recommendationRequestRepository.findByUserAndRequestDate(testUser, LocalDate.now()))
                    .thenReturn(Optional.of(existingRequest));

            boolean canMakeRequest = rateLimitService.canMakeRequest(testUser);
            
            assertTrue(canMakeRequest);
        }

        @Test
        @DisplayName("Should deny request when at limit")
        void shouldDenyRequestWhenAtLimit() {
            RecommendationRequest existingRequest = RecommendationRequest.builder()
                    .user(testUser)
                    .requestDate(LocalDate.now())
                    .requestCount(3)
                    .maxRequestsPerDay(3)
                    .build();

            when(recommendationRequestRepository.findByUserAndRequestDate(testUser, LocalDate.now()))
                    .thenReturn(Optional.of(existingRequest));

            boolean canMakeRequest = rateLimitService.canMakeRequest(testUser);
            
            assertFalse(canMakeRequest);
        }

        @Test
        @DisplayName("Should create new request record for new user")
        void shouldCreateNewRequestRecordForNewUser() {
            when(recommendationRequestRepository.findByUserAndRequestDate(testUser, LocalDate.now()))
                    .thenReturn(Optional.empty());

            rateLimitService.recordRequest(testUser);

            verify(recommendationRequestRepository).save(argThat(request -> 
                request.getUser().equals(testUser) &&
                request.getRequestDate().equals(LocalDate.now()) &&
                request.getRequestCount().equals(1) &&
                request.getMaxRequestsPerDay().equals(3)
            ));
        }

        @Test
        @DisplayName("Should increment existing request count")
        void shouldIncrementExistingRequestCount() {
            RecommendationRequest existingRequest = RecommendationRequest.builder()
                    .id(1L)
                    .user(testUser)
                    .requestDate(LocalDate.now())
                    .requestCount(1)
                    .maxRequestsPerDay(3)
                    .build();

            when(recommendationRequestRepository.findByUserAndRequestDate(testUser, LocalDate.now()))
                    .thenReturn(Optional.of(existingRequest));

            rateLimitService.recordRequest(testUser);

            assertEquals(2, existingRequest.getRequestCount());
            verify(recommendationRequestRepository).save(existingRequest);
        }

        @Test
        @DisplayName("Should return correct remaining requests")
        void shouldReturnCorrectRemainingRequests() {
            RecommendationRequest existingRequest = RecommendationRequest.builder()
                    .user(testUser)
                    .requestDate(LocalDate.now())
                    .requestCount(1)
                    .maxRequestsPerDay(3)
                    .build();

            when(recommendationRequestRepository.findByUserAndRequestDate(testUser, LocalDate.now()))
                    .thenReturn(Optional.of(existingRequest));

            int remainingRequests = rateLimitService.getRemainingRequests(testUser);
            
            assertEquals(2, remainingRequests);
        }

        @Test
        @DisplayName("Should return max requests for new user")
        void shouldReturnMaxRequestsForNewUser() {
            when(recommendationRequestRepository.findByUserAndRequestDate(testUser, LocalDate.now()))
                    .thenReturn(Optional.empty());

            int remainingRequests = rateLimitService.getRemainingRequests(testUser);
            
            assertEquals(3, remainingRequests);
        }

        @Test
        @DisplayName("Should return 0 when at limit")
        void shouldReturnZeroWhenAtLimit() {
            RecommendationRequest existingRequest = RecommendationRequest.builder()
                    .user(testUser)
                    .requestDate(LocalDate.now())
                    .requestCount(3)
                    .maxRequestsPerDay(3)
                    .build();

            when(recommendationRequestRepository.findByUserAndRequestDate(testUser, LocalDate.now()))
                    .thenReturn(Optional.of(existingRequest));

            int remainingRequests = rateLimitService.getRemainingRequests(testUser);
            
            assertEquals(0, remainingRequests);
        }

        @Test
        @DisplayName("Should clean old requests")
        void shouldCleanOldRequests() {
            LocalDate cutoffDate = LocalDate.now().minusDays(30);
            
            rateLimitService.cleanOldRequests();
            
            verify(recommendationRequestRepository).deleteByRequestDateBefore(cutoffDate);
        }
    }
}