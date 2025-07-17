package com.nextread.controller;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nextread.dto.LoginUserDTO;
import com.nextread.dto.RegisterUserDTO;
import com.nextread.dto.VerifyUserDTO;
import com.nextread.entities.User;
import com.nextread.services.AuthenticationService;
import com.nextread.services.JwtService;

@ExtendWith(MockitoExtension.class)
public class AuthenticationControllerTest {

    @Mock
    private AuthenticationService authenticationService;

    @Mock
    private JwtService jwtService;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        AuthenticationController controller = new AuthenticationController(jwtService, authenticationService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Nested
    @DisplayName("User Registration Tests")
    class UserRegistrationTests {

        @Test
        @DisplayName("Should register user successfully")
        void shouldRegisterUserSuccessfully() throws Exception {
            // Given
            RegisterUserDTO registerDTO = new RegisterUserDTO();
            registerDTO.setEmail("test@example.com");
            registerDTO.setUsername("testuser");
            registerDTO.setPassword("password123");

            User registeredUser = new User();
            registeredUser.setId(1L);
            registeredUser.setEmail("test@example.com");
            registeredUser.setNickname("testuser");

            when(authenticationService.signUp(any(RegisterUserDTO.class))).thenReturn(registeredUser);

            // When & Then
            mockMvc.perform(post("/auth/signup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(registerDTO)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(1))
                    .andExpect(jsonPath("$.email").value("test@example.com"))
                    .andExpect(jsonPath("$.nickname").value("testuser"));

            verify(authenticationService).signUp(any(RegisterUserDTO.class));
        }

        @Test
        @DisplayName("Should call service with registration data")
        void shouldCallServiceWithRegistrationData() throws Exception {
            // Given
            RegisterUserDTO registerDTO = new RegisterUserDTO();
            registerDTO.setEmail("different@example.com");
            registerDTO.setUsername("differentuser");
            registerDTO.setPassword("password456");

            User registeredUser = new User();
            registeredUser.setId(2L);
            registeredUser.setEmail("different@example.com");
            registeredUser.setNickname("differentuser");

            when(authenticationService.signUp(any(RegisterUserDTO.class))).thenReturn(registeredUser);

            // When & Then
            mockMvc.perform(post("/auth/signup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(registerDTO)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(2))
                    .andExpect(jsonPath("$.email").value("different@example.com"))
                    .andExpect(jsonPath("$.nickname").value("differentuser"));

            verify(authenticationService).signUp(any(RegisterUserDTO.class));
        }
    }

    @Nested
    @DisplayName("User Login Tests")
    class UserLoginTests {

        @Test
        @DisplayName("Should login user successfully")
        void shouldLoginUserSuccessfully() throws Exception {
            // Given
            LoginUserDTO loginDTO = new LoginUserDTO();
            loginDTO.setEmail("test@example.com");
            loginDTO.setPassword("password123");

            User authenticatedUser = new User();
            authenticatedUser.setId(1L);
            authenticatedUser.setEmail("test@example.com");

            String jwtToken = "jwt-token-123";
            long expirationTime = 3600000L;

            when(authenticationService.authenticate(any(LoginUserDTO.class))).thenReturn(authenticatedUser);
            when(jwtService.generateToken(authenticatedUser)).thenReturn(jwtToken);
            when(jwtService.getExpirationTime()).thenReturn(expirationTime);

            // When & Then
            mockMvc.perform(post("/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(loginDTO)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.token").value(jwtToken))
                    .andExpect(jsonPath("$.expiresIn").value(expirationTime));

            verify(authenticationService).authenticate(any(LoginUserDTO.class));
            verify(jwtService).generateToken(authenticatedUser);
            verify(jwtService).getExpirationTime();
        }

        @Test
        @DisplayName("Should call authentication service with login data")
        void shouldCallAuthenticationServiceWithLoginData() throws Exception {
            // Given
            LoginUserDTO loginDTO = new LoginUserDTO();
            loginDTO.setEmail("another@example.com");
            loginDTO.setPassword("password789");

            User authenticatedUser = new User();
            authenticatedUser.setId(2L);
            authenticatedUser.setEmail("another@example.com");

            String jwtToken = "jwt-token-456";
            long expirationTime = 7200000L;

            when(authenticationService.authenticate(any(LoginUserDTO.class))).thenReturn(authenticatedUser);
            when(jwtService.generateToken(authenticatedUser)).thenReturn(jwtToken);
            when(jwtService.getExpirationTime()).thenReturn(expirationTime);

            // When & Then
            mockMvc.perform(post("/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(loginDTO)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.token").value(jwtToken))
                    .andExpect(jsonPath("$.expiresIn").value(expirationTime));

            verify(authenticationService).authenticate(any(LoginUserDTO.class));
            verify(jwtService).generateToken(authenticatedUser);
            verify(jwtService).getExpirationTime();
        }
    }

    @Nested
    @DisplayName("User Verification Tests")
    class UserVerificationTests {

        @Test
        @DisplayName("Should verify user successfully")
        void shouldVerifyUserSuccessfully() throws Exception {
            // Given
            VerifyUserDTO verifyDTO = new VerifyUserDTO();
            verifyDTO.setEmail("test@example.com");
            verifyDTO.setVerificationCode("123456");

            doNothing().when(authenticationService).verifyUser(any(VerifyUserDTO.class));

            // When & Then
            mockMvc.perform(post("/auth/verify")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(verifyDTO)))
                    .andExpect(status().isOk())
                    .andExpect(content().string("Cuenta verificada correctamente"));

            verify(authenticationService).verifyUser(any(VerifyUserDTO.class));
        }

        @Test
        @DisplayName("Should handle verification failure")
        void shouldHandleVerificationFailure() throws Exception {
            // Given
            VerifyUserDTO verifyDTO = new VerifyUserDTO();
            verifyDTO.setEmail("test@example.com");
            verifyDTO.setVerificationCode("wrong-code");

            doThrow(new RuntimeException("El código de verificación es incorrecto"))
                    .when(authenticationService).verifyUser(any(VerifyUserDTO.class));

            // When & Then
            mockMvc.perform(post("/auth/verify")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(verifyDTO)))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string("El código de verificación es incorrecto"));

            verify(authenticationService).verifyUser(any(VerifyUserDTO.class));
        }

        @Test
        @DisplayName("Should handle expired verification code")
        void shouldHandleExpiredVerificationCode() throws Exception {
            // Given
            VerifyUserDTO verifyDTO = new VerifyUserDTO();
            verifyDTO.setEmail("test@example.com");
            verifyDTO.setVerificationCode("123456");

            doThrow(new RuntimeException("El código de verificación ha expirado"))
                    .when(authenticationService).verifyUser(any(VerifyUserDTO.class));

            // When & Then
            mockMvc.perform(post("/auth/verify")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(verifyDTO)))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string("El código de verificación ha expirado"));

            verify(authenticationService).verifyUser(any(VerifyUserDTO.class));
        }
    }

    @Nested
    @DisplayName("Resend Verification Code Tests")
    class ResendVerificationCodeTests {

        @Test
        @DisplayName("Should resend verification code successfully")
        void shouldResendVerificationCodeSuccessfully() throws Exception {
            // Given
            String email = "test@example.com";

            doNothing().when(authenticationService).resendVerificationCode(email);

            // When & Then
            mockMvc.perform(post("/auth/resend")
                    .param("email", email))
                    .andExpect(status().isOk())
                    .andExpect(content().string("Código de verificación enviado nuevamente"));

            verify(authenticationService).resendVerificationCode(email);
        }

        @Test
        @DisplayName("Should handle resend failure")
        void shouldHandleResendFailure() throws Exception {
            // Given
            String email = "test@example.com";

            doThrow(new RuntimeException("La cuenta ya ha sido verificada"))
                    .when(authenticationService).resendVerificationCode(email);

            // When & Then
            mockMvc.perform(post("/auth/resend")
                    .param("email", email))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string("La cuenta ya ha sido verificada"));

            verify(authenticationService).resendVerificationCode(email);
        }

        @Test
        @DisplayName("Should handle user not found for resend")
        void shouldHandleUserNotFoundForResend() throws Exception {
            // Given
            String email = "nonexistent@example.com";

            doThrow(new RuntimeException("Usuario no encontrado"))
                    .when(authenticationService).resendVerificationCode(email);

            // When & Then
            mockMvc.perform(post("/auth/resend")
                    .param("email", email))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string("Usuario no encontrado"));

            verify(authenticationService).resendVerificationCode(email);
        }
    }
}