package com.nextread.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import com.nextread.dto.LoginUserDTO;
import com.nextread.dto.RegisterUserDTO;
import com.nextread.dto.VerifyUserDTO;
import com.nextread.entities.User;
import com.nextread.repositories.UserRepository;

import jakarta.mail.MessagingException;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private EmailService emailService;

    @Mock
    private SurveyService surveyService;

    @InjectMocks
    private AuthenticationService authenticationService;

    private User testUser;
    private RegisterUserDTO registerUserDTO;
    private LoginUserDTO loginUserDTO;
    private VerifyUserDTO verifyUserDTO;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setNickname("testuser");
        testUser.setPassword("encodedPassword");
        testUser.setEnabled(true);
        testUser.setVerificationCode("123456");
        testUser.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));

        registerUserDTO = new RegisterUserDTO();
        registerUserDTO.setEmail("test@example.com");
        registerUserDTO.setUsername("testuser");
        registerUserDTO.setPassword("password123");

        loginUserDTO = new LoginUserDTO();
        loginUserDTO.setEmail("test@example.com");
        loginUserDTO.setPassword("password123");

        verifyUserDTO = new VerifyUserDTO();
        verifyUserDTO.setEmail("test@example.com");
        verifyUserDTO.setVerificationCode("123456");
    }

    @Nested
    @DisplayName("Sign Up Tests")
    class SignUpTests {

        @Test
        @DisplayName("Should successfully register a new user")
        void shouldSuccessfullyRegisterNewUser() throws MessagingException {
            // Given
            when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
                User user = invocation.getArgument(0);
                user.setId(1L);
                return user;
            });
            doNothing().when(emailService).sendVerificationEmail(anyString(), anyString(), anyString());

            // When
            User result = authenticationService.signUp(registerUserDTO);

            // Then
            assertNotNull(result);
            assertEquals("test@example.com", result.getEmail());
            assertEquals("testuser", result.getNickname());
            assertEquals("encodedPassword", result.getPassword());
            assertFalse(result.isEnabled());
            assertNotNull(result.getVerificationCode());
            assertNotNull(result.getVerificationCodeExpiresAt());
            assertTrue(result.getVerificationCodeExpiresAt().isAfter(LocalDateTime.now()));

            verify(passwordEncoder).encode("password123");
            verify(userRepository).save(any(User.class));
            verify(emailService).sendVerificationEmail(eq("test@example.com"), anyString(), anyString());
        }

        @Test
        @DisplayName("Should generate verification code of correct length")
        void shouldGenerateVerificationCodeOfCorrectLength() {
            // Given
            when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // When
            User result = authenticationService.signUp(registerUserDTO);

            // Then
            assertNotNull(result.getVerificationCode());
            assertEquals(6, result.getVerificationCode().length());
            assertTrue(result.getVerificationCode().matches("\\d{6}"));
        }

        @Test
        @DisplayName("Should set verification code expiration to 15 minutes")
        void shouldSetVerificationCodeExpirationTo15Minutes() {
            // Given
            when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            LocalDateTime beforeSignUp = LocalDateTime.now().plusMinutes(14);
            LocalDateTime afterSignUp = LocalDateTime.now().plusMinutes(16);

            // When
            User result = authenticationService.signUp(registerUserDTO);

            // Then
            assertNotNull(result.getVerificationCodeExpiresAt());
            assertTrue(result.getVerificationCodeExpiresAt().isAfter(beforeSignUp));
            assertTrue(result.getVerificationCodeExpiresAt().isBefore(afterSignUp));
        }

        @Test
        @DisplayName("Should handle email service exception gracefully")
        void shouldHandleEmailServiceExceptionGracefully() throws MessagingException {
            // Given
            when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
            doThrow(new MessagingException("Email service error")).when(emailService)
                    .sendVerificationEmail(anyString(), anyString(), anyString());

            // When & Then - Should not throw exception
            assertDoesNotThrow(() -> {
                User result = authenticationService.signUp(registerUserDTO);
                assertNotNull(result);
            });

            verify(emailService).sendVerificationEmail(anyString(), anyString(), anyString());
        }
    }

    @Nested
    @DisplayName("Authentication Tests")
    class AuthenticationTests {

        @Test
        @DisplayName("Should successfully authenticate enabled user")
        void shouldSuccessfullyAuthenticateEnabledUser() {
            // Given
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenReturn(new UsernamePasswordAuthenticationToken("test@example.com", "password123"));

            // When
            User result = authenticationService.authenticate(loginUserDTO);

            // Then
            assertNotNull(result);
            assertEquals("test@example.com", result.getEmail());
            assertEquals("testuser", result.getNickname());
            assertTrue(result.isEnabled());

            verify(userRepository).findByEmail("test@example.com");
            verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        }

        @Test
        @DisplayName("Should throw exception when user not found")
        void shouldThrowExceptionWhenUserNotFound() {
            // Given
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

            // When & Then
            RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                authenticationService.authenticate(loginUserDTO);
            });

            assertEquals("Las credenciales ingresadas no son válidas.", exception.getMessage());
            verify(userRepository).findByEmail("test@example.com");
            verify(authenticationManager, never()).authenticate(any());
        }

        @Test
        @DisplayName("Should throw exception when user not enabled")
        void shouldThrowExceptionWhenUserNotEnabled() {
            // Given
            testUser.setEnabled(false);
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

            // When & Then
            RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                authenticationService.authenticate(loginUserDTO);
            });

            assertEquals("La cuenta todavía no está verificada. Por favor, verifica tu email antes de iniciar sesión.",
                    exception.getMessage());
            verify(userRepository).findByEmail("test@example.com");
            verify(authenticationManager, never()).authenticate(any());
        }

        @Test
        @DisplayName("Should propagate authentication manager exceptions")
        void shouldPropagateAuthenticationManagerExceptions() {
            // Given
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenThrow(new RuntimeException("Invalid credentials"));

            // When & Then
            RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                authenticationService.authenticate(loginUserDTO);
            });

            assertEquals("Las credenciales ingresadas no son válidas.", exception.getMessage());
            verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        }
    }

    @Nested
    @DisplayName("Verify User Tests")
    class VerifyUserTests {

        @Test
        @DisplayName("Should successfully verify user with valid code")
        void shouldSuccessfullyVerifyUserWithValidCode() {
            // Given
            testUser.setEnabled(false);
            testUser.setVerificationCode("123456");
            testUser.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(10));

            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // When
            assertDoesNotThrow(() -> {
                authenticationService.verifyUser(verifyUserDTO);
            });

            // Then
            assertTrue(testUser.isEnabled());
            assertNull(testUser.getVerificationCode());
            assertNull(testUser.getVerificationCodeExpiresAt());

            verify(userRepository).findByEmail("test@example.com");
            verify(userRepository).save(testUser);
        }

        @Test
        @DisplayName("Should throw exception when user not found")
        void shouldThrowExceptionWhenUserNotFoundForVerification() {
            // Given
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

            // When & Then
            RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                authenticationService.verifyUser(verifyUserDTO);
            });

            assertEquals("Usuario no encontrado", exception.getMessage());
            verify(userRepository).findByEmail("test@example.com");
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should throw exception when verification code expired")
        void shouldThrowExceptionWhenVerificationCodeExpired() {
            // Given
            testUser.setVerificationCodeExpiresAt(LocalDateTime.now().minusMinutes(10));
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

            // When & Then
            RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                authenticationService.verifyUser(verifyUserDTO);
            });

            assertEquals("El código de verificación ha expirado.", exception.getMessage());
            verify(userRepository).findByEmail("test@example.com");
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should throw exception when verification code incorrect")
        void shouldThrowExceptionWhenVerificationCodeIncorrect() {
            // Given
            testUser.setVerificationCode("654321");
            testUser.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(10));
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

            // When & Then
            RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                authenticationService.verifyUser(verifyUserDTO);
            });

            assertEquals("El código de verificación es incorrecto", exception.getMessage());
            verify(userRepository).findByEmail("test@example.com");
            verify(userRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("Resend Verification Code Tests")
    class ResendVerificationCodeTests {

        @Test
        @DisplayName("Should successfully resend verification code")
        void shouldSuccessfullyResendVerificationCode() throws MessagingException {
            // Given
            testUser.setEnabled(false);
            testUser.setVerificationCode("oldCode");
            testUser.setVerificationCodeExpiresAt(LocalDateTime.now().minusMinutes(5));

            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
            doNothing().when(emailService).sendVerificationEmail(anyString(), anyString(), anyString());

            // When
            assertDoesNotThrow(() -> {
                authenticationService.resendVerificationCode("test@example.com");
            });

            // Then
            assertNotEquals("oldCode", testUser.getVerificationCode());
            assertNotNull(testUser.getVerificationCode());
            assertEquals(6, testUser.getVerificationCode().length());
            assertTrue(testUser.getVerificationCodeExpiresAt().isAfter(LocalDateTime.now().plusMinutes(50)));

            verify(userRepository).findByEmail("test@example.com");
            verify(userRepository).save(testUser);
            verify(emailService).sendVerificationEmail(eq("test@example.com"), anyString(), anyString());
        }

        @Test
        @DisplayName("Should throw exception when user not found")
        void shouldThrowExceptionWhenUserNotFoundForResend() {
            // Given
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

            // When & Then
            RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                authenticationService.resendVerificationCode("test@example.com");
            });

            assertEquals("Usuario no encontrado", exception.getMessage());
            verify(userRepository).findByEmail("test@example.com");
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should throw exception when user already verified")
        void shouldThrowExceptionWhenUserAlreadyVerified() {
            // Given
            testUser.setEnabled(true);
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

            // When & Then
            RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                authenticationService.resendVerificationCode("test@example.com");
            });

            assertEquals("La cuenta ya ha sido verificada", exception.getMessage());
            verify(userRepository).findByEmail("test@example.com");
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should set verification code expiration to 1 hour")
        void shouldSetVerificationCodeExpirationTo1Hour() {
            // Given
            testUser.setEnabled(false);
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            LocalDateTime beforeResend = LocalDateTime.now().plusMinutes(50);
            LocalDateTime afterResend = LocalDateTime.now().plusMinutes(70);

            // When
            authenticationService.resendVerificationCode("test@example.com");

            // Then
            assertNotNull(testUser.getVerificationCodeExpiresAt());
            assertTrue(testUser.getVerificationCodeExpiresAt().isAfter(beforeResend));
            assertTrue(testUser.getVerificationCodeExpiresAt().isBefore(afterResend));
        }

        @Test
        @DisplayName("Should handle email service exception gracefully")
        void shouldHandleEmailServiceExceptionGracefullyOnResend() throws MessagingException {
            // Given
            testUser.setEnabled(false);
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
            doThrow(new MessagingException("Email service error")).when(emailService)
                    .sendVerificationEmail(anyString(), anyString(), anyString());

            // When & Then - Should not throw exception
            assertDoesNotThrow(() -> {
                authenticationService.resendVerificationCode("test@example.com");
            });

            verify(emailService).sendVerificationEmail(anyString(), anyString(), anyString());
        }
    }

    @Nested
    @DisplayName("Private Method Tests")
    class PrivateMethodTests {

        @Test
        @DisplayName("Should generate verification code with correct format")
        void shouldGenerateVerificationCodeWithCorrectFormat() {
            // When
            String code1 = (String) ReflectionTestUtils.invokeMethod(authenticationService, "generateVerificationCode");
            String code2 = (String) ReflectionTestUtils.invokeMethod(authenticationService, "generateVerificationCode");

            // Then
            assertNotNull(code1);
            assertNotNull(code2);
            assertEquals(6, code1.length());
            assertEquals(6, code2.length());
            assertTrue(code1.matches("\\d{6}"));
            assertTrue(code2.matches("\\d{6}"));

            // Should generate different codes (with high probability)
            assertNotEquals(code1, code2);
        }

        @Test
        @DisplayName("Should generate verification code in valid range")
        void shouldGenerateVerificationCodeInValidRange() {
            // When - Generate multiple codes to test range
            for (int i = 0; i < 100; i++) {
                String code = (String) ReflectionTestUtils.invokeMethod(authenticationService,
                        "generateVerificationCode");
                int codeInt = Integer.parseInt(code);

                // Then
                assertTrue(codeInt >= 100000);
                assertTrue(codeInt <= 999999);
            }
        }

        @Test
        @DisplayName("Should call email service with correct parameters")
        void shouldCallEmailServiceWithCorrectParameters() throws MessagingException {
            // Given
            testUser.setVerificationCode("123456");
            doNothing().when(emailService).sendVerificationEmail(anyString(), anyString(), anyString());

            // When
            ReflectionTestUtils.invokeMethod(authenticationService, "sendVerificationEmail", testUser);

            // Then
            verify(emailService).sendVerificationEmail(
                    eq("test@example.com"),
                    eq("Account Verification"),
                    contains("VERIFICATION CODE 123456"));
        }
    }
}