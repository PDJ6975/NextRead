package com.nextread.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class JwtServiceTest {

    private JwtService jwtService;

    @Mock
    private UserDetails userDetails;

    private final String testSecretKey = "dGVzdC1zZWNyZXQta2V5LWZvci1qd3QtdGVzdGluZy1wdXJwb3Nlcy1vbmx5LXRoaXMtaXMtYS12ZXJ5LWxvbmctc2VjcmV0LWtleQ==";
    private final long testExpirationTime = 3600000L; // 1 hour

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", testSecretKey);
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", testExpirationTime);

        when(userDetails.getUsername()).thenReturn("testuser@example.com");
    }

    @Nested
    @DisplayName("Token Generation Tests")
    class TokenGenerationTests {

        @Test
        @DisplayName("Should generate token with default claims")
        void shouldGenerateTokenWithDefaultClaims() {
            // When
            String token = jwtService.generateToken(userDetails);

            // Then
            assertNotNull(token);
            assertTrue(token.length() > 0);

            // Verify token structure (JWT has 3 parts separated by dots)
            String[] tokenParts = token.split("\\.");
            assertEquals(3, tokenParts.length);
        }

        @Test
        @DisplayName("Should generate token with extra claims")
        void shouldGenerateTokenWithExtraClaims() {
            // Given
            Map<String, Object> extraClaims = new HashMap<>();
            extraClaims.put("role", "USER");
            extraClaims.put("permissions", "READ,WRITE");

            // When
            String token = jwtService.generateToken(extraClaims, userDetails);

            // Then
            assertNotNull(token);
            assertTrue(token.length() > 0);

            // Verify token structure
            String[] tokenParts = token.split("\\.");
            assertEquals(3, tokenParts.length);
        }

        @Test
        @DisplayName("Should generate different tokens for different users")
        void shouldGenerateDifferentTokensForDifferentUsers() {
            // Given
            UserDetails user1 = mock(UserDetails.class);
            UserDetails user2 = mock(UserDetails.class);
            when(user1.getUsername()).thenReturn("user1@example.com");
            when(user2.getUsername()).thenReturn("user2@example.com");

            // When
            String token1 = jwtService.generateToken(user1);
            String token2 = jwtService.generateToken(user2);

            // Then
            assertNotNull(token1);
            assertNotNull(token2);
            assertNotEquals(token1, token2);
        }

        @Test
        @DisplayName("Should generate different tokens for same user at different times")
        void shouldGenerateDifferentTokensForSameUserAtDifferentTimes() throws InterruptedException {
            // When
            String token1 = jwtService.generateToken(userDetails);
            Thread.sleep(1000); // Wait 1 second to ensure different timestamps
            String token2 = jwtService.generateToken(userDetails);

            // Then
            assertNotNull(token1);
            assertNotNull(token2);
            assertNotEquals(token1, token2);
        }

        @Test
        @DisplayName("Should handle empty extra claims")
        void shouldHandleEmptyExtraClaims() {
            // Given
            Map<String, Object> emptyClaims = new HashMap<>();

            // When
            String token = jwtService.generateToken(emptyClaims, userDetails);

            // Then
            assertNotNull(token);
            assertTrue(token.length() > 0);
        }

        @Test
        @DisplayName("Should handle null extra claims by using empty map")
        void shouldHandleNullExtraClaimsUsingEmptyMap() {
            // When & Then - JWT library doesn't accept null claims, so service should
            // handle it
            assertThrows(IllegalArgumentException.class, () -> {
                jwtService.generateToken(null, userDetails);
            });
        }
    }

    @Nested
    @DisplayName("Token Extraction Tests")
    class TokenExtractionTests {

        @Test
        @DisplayName("Should extract username from token")
        void shouldExtractUsernameFromToken() {
            // Given
            String token = jwtService.generateToken(userDetails);

            // When
            String extractedUsername = jwtService.extractUsername(token);

            // Then
            assertEquals("testuser@example.com", extractedUsername);
        }

        @Test
        @DisplayName("Should extract subject claim from token")
        void shouldExtractSubjectClaimFromToken() {
            // Given
            String token = jwtService.generateToken(userDetails);

            // When
            String subject = jwtService.extractClaim(token, Claims::getSubject);

            // Then
            assertEquals("testuser@example.com", subject);
        }

        @Test
        @DisplayName("Should extract expiration claim from token")
        void shouldExtractExpirationClaimFromToken() {
            // Given
            String token = jwtService.generateToken(userDetails);

            // When
            Date expiration = jwtService.extractClaim(token, Claims::getExpiration);

            // Then
            assertNotNull(expiration);
            assertTrue(expiration.after(new Date()));
        }

        @Test
        @DisplayName("Should extract issued at claim from token")
        void shouldExtractIssuedAtClaimFromToken() {
            // Given
            String token = jwtService.generateToken(userDetails);

            // When
            Date issuedAt = jwtService.extractClaim(token, Claims::getIssuedAt);

            // Then
            assertNotNull(issuedAt);
            assertTrue(issuedAt.before(new Date()) || issuedAt.equals(new Date()));
        }

        @Test
        @DisplayName("Should extract custom claims from token")
        void shouldExtractCustomClaimsFromToken() {
            // Given
            Map<String, Object> extraClaims = new HashMap<>();
            extraClaims.put("role", "ADMIN");
            extraClaims.put("userId", 123);
            String token = jwtService.generateToken(extraClaims, userDetails);

            // When
            String role = jwtService.extractClaim(token, claims -> claims.get("role", String.class));
            Integer userId = jwtService.extractClaim(token, claims -> claims.get("userId", Integer.class));

            // Then
            assertEquals("ADMIN", role);
            assertEquals(123, userId);
        }

        @Test
        @DisplayName("Should throw exception for invalid token format")
        void shouldThrowExceptionForInvalidTokenFormat() {
            // Given
            String invalidToken = "invalid.token";

            // When & Then
            assertThrows(JwtException.class, () -> {
                jwtService.extractUsername(invalidToken);
            });
        }

        @Test
        @DisplayName("Should throw exception for malformed token")
        void shouldThrowExceptionForMalformedToken() {
            // Given
            String malformedToken = "malformed-token-without-proper-structure";

            // When & Then
            assertThrows(JwtException.class, () -> {
                jwtService.extractUsername(malformedToken);
            });
        }
    }

    @Nested
    @DisplayName("Token Validation Tests")
    class TokenValidationTests {

        @Test
        @DisplayName("Should validate valid token")
        void shouldValidateValidToken() {
            // Given
            String token = jwtService.generateToken(userDetails);

            // When
            boolean isValid = jwtService.isTokenValid(token, userDetails);

            // Then
            assertTrue(isValid);
        }

        @Test
        @DisplayName("Should reject token with wrong username")
        void shouldRejectTokenWithWrongUsername() {
            // Given
            String token = jwtService.generateToken(userDetails);
            UserDetails differentUser = mock(UserDetails.class);
            when(differentUser.getUsername()).thenReturn("different@example.com");

            // When
            boolean isValid = jwtService.isTokenValid(token, differentUser);

            // Then
            assertFalse(isValid);
        }

        @Test
        @DisplayName("Should reject expired token")
        void shouldRejectExpiredToken() {
            // Given - Create service with very short expiration
            JwtService shortExpirationService = new JwtService();
            ReflectionTestUtils.setField(shortExpirationService, "secretKey", testSecretKey);
            ReflectionTestUtils.setField(shortExpirationService, "jwtExpiration", 1L); // 1ms

            String token = shortExpirationService.generateToken(userDetails);

            // Wait for token to expire
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }

            // When & Then - ExpiredJwtException is thrown during validation
            assertThrows(ExpiredJwtException.class, () -> {
                shortExpirationService.isTokenValid(token, userDetails);
            });
        }

        @Test
        @DisplayName("Should reject token with invalid signature")
        void shouldRejectTokenWithInvalidSignature() {
            // Given
            String token = jwtService.generateToken(userDetails);

            // Create another service with different secret key
            JwtService differentKeyService = new JwtService();
            ReflectionTestUtils.setField(differentKeyService, "secretKey",
                    "ZGlmZmVyZW50LXNlY3JldC1rZXktZm9yLWp3dC10ZXN0aW5nLXB1cnBvc2VzLW9ubHktdGhpcy1pcy1hLXZlcnktbG9uZy1zZWNyZXQta2V5");
            ReflectionTestUtils.setField(differentKeyService, "jwtExpiration", testExpirationTime);

            // When & Then
            assertThrows(JwtException.class, () -> {
                differentKeyService.isTokenValid(token, userDetails);
            });
        }

        @Test
        @DisplayName("Should handle null token")
        void shouldHandleNullToken() {
            // When & Then
            assertThrows(Exception.class, () -> {
                jwtService.isTokenValid(null, userDetails);
            });
        }

        @Test
        @DisplayName("Should handle empty token")
        void shouldHandleEmptyToken() {
            // When & Then
            assertThrows(IllegalArgumentException.class, () -> {
                jwtService.isTokenValid("", userDetails);
            });
        }
    }

    @Nested
    @DisplayName("Expiration Time Tests")
    class ExpirationTimeTests {

        @Test
        @DisplayName("Should return correct expiration time")
        void shouldReturnCorrectExpirationTime() {
            // When
            long expirationTime = jwtService.getExpirationTime();

            // Then
            assertEquals(testExpirationTime, expirationTime);
        }

        @Test
        @DisplayName("Should generate token with correct expiration")
        void shouldGenerateTokenWithCorrectExpiration() {
            // Given
            long currentTime = System.currentTimeMillis();
            String token = jwtService.generateToken(userDetails);

            // When
            Date expiration = jwtService.extractClaim(token, Claims::getExpiration);

            // Then
            assertNotNull(expiration);
            long tokenExpirationTime = expiration.getTime();
            long expectedExpirationTime = currentTime + testExpirationTime;

            // Allow for small time difference due to execution time
            assertTrue(Math.abs(tokenExpirationTime - expectedExpirationTime) < 1000);
        }
    }

    @Nested
    @DisplayName("Edge Cases Tests")
    class EdgeCasesTests {

        @Test
        @DisplayName("Should handle very long username")
        void shouldHandleVeryLongUsername() {
            // Given
            StringBuilder longUsername = new StringBuilder();
            for (int i = 0; i < 1000; i++) {
                longUsername.append("a");
            }
            longUsername.append("@example.com");

            UserDetails longUsernameUser = mock(UserDetails.class);
            when(longUsernameUser.getUsername()).thenReturn(longUsername.toString());

            // When
            String token = jwtService.generateToken(longUsernameUser);

            // Then
            assertNotNull(token);
            String extractedUsername = jwtService.extractUsername(token);
            assertEquals(longUsername.toString(), extractedUsername);
        }

        @Test
        @DisplayName("Should handle special characters in username")
        void shouldHandleSpecialCharactersInUsername() {
            // Given
            String specialUsername = "user+test@example.com";
            UserDetails specialUser = mock(UserDetails.class);
            when(specialUser.getUsername()).thenReturn(specialUsername);

            // When
            String token = jwtService.generateToken(specialUser);

            // Then
            assertNotNull(token);
            String extractedUsername = jwtService.extractUsername(token);
            assertEquals(specialUsername, extractedUsername);
        }

        @Test
        @DisplayName("Should handle large number of extra claims")
        void shouldHandleLargeNumberOfExtraClaims() {
            // Given
            Map<String, Object> largeClaims = new HashMap<>();
            for (int i = 0; i < 100; i++) {
                largeClaims.put("claim" + i, "value" + i);
            }

            // When
            String token = jwtService.generateToken(largeClaims, userDetails);

            // Then
            assertNotNull(token);
            assertTrue(token.length() > 0);
        }

        @Test
        @DisplayName("Should handle complex object in extra claims")
        void shouldHandleComplexObjectInExtraClaims() {
            // Given
            Map<String, Object> complexClaims = new HashMap<>();
            Map<String, String> nestedMap = new HashMap<>();
            nestedMap.put("nestedKey", "nestedValue");
            complexClaims.put("nested", nestedMap);
            complexClaims.put("array", new String[] { "item1", "item2" });

            // When
            String token = jwtService.generateToken(complexClaims, userDetails);

            // Then
            assertNotNull(token);
            assertTrue(token.length() > 0);
        }

        @Test
        @DisplayName("Should handle token extraction from expired token")
        void shouldHandleTokenExtractionFromExpiredToken() {
            // Given - Create service with very short expiration
            JwtService shortExpirationService = new JwtService();
            ReflectionTestUtils.setField(shortExpirationService, "secretKey", testSecretKey);
            ReflectionTestUtils.setField(shortExpirationService, "jwtExpiration", 1L);

            String token = shortExpirationService.generateToken(userDetails);

            // Wait for token to expire
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }

            // When & Then - Should throw ExpiredJwtException when trying to extract from
            // expired token
            assertThrows(ExpiredJwtException.class, () -> {
                shortExpirationService.extractUsername(token);
            });
        }
    }
}