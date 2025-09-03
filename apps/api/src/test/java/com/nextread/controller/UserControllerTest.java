package com.nextread.controller;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Map;

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
import com.nextread.entities.User;
import com.nextread.services.UserService;
import com.nextread.services.SurveyService;

@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private SurveyService surveyService;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private User testUser;

    @BeforeEach
    void setUp() {
        UserController controller = new UserController(userService, surveyService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setNickname("testuser");
        testUser.setAvatarUrl("https://example.com/avatar.jpg");

        // Set up security context
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(testUser, null, List.of()));
    }

    @Nested
    @DisplayName("Get User Profile Tests")
    class GetUserProfileTests {

        @Test
        @DisplayName("Should return user profile successfully")
        void shouldReturnUserProfileSuccessfully() throws Exception {
            // When & Then
            mockMvc.perform(get("/users/me")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.nickname").value("testuser"))
                    .andExpect(jsonPath("$.avatarUrl").value("https://example.com/avatar.jpg"));
        }
    }

    @Nested
    @DisplayName("Update Avatar Tests")
    class UpdateAvatarTests {

        @Test
        @DisplayName("Should update avatar successfully")
        void shouldUpdateAvatarSuccessfully() throws Exception {
            // Given
            String newAvatarUrl = "https://example.com/new-avatar.jpg";
            when(userService.updateAvatar(anyString(), any(User.class))).thenReturn(newAvatarUrl);

            // When & Then
            mockMvc.perform(put("/users/avatar")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(newAvatarUrl)))
                    .andExpect(status().isOk())
                    .andExpect(content().string(newAvatarUrl));

            verify(userService).updateAvatar(anyString(), any(User.class));
        }

        @Test
        @DisplayName("Should call service with avatar parameter")
        void shouldCallServiceWithAvatarParameter() throws Exception {
            // Given
            String newAvatarUrl = "https://example.com/different-avatar.jpg";
            when(userService.updateAvatar(anyString(), any(User.class))).thenReturn(newAvatarUrl);

            // When & Then
            mockMvc.perform(put("/users/avatar")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(newAvatarUrl)))
                    .andExpect(status().isOk())
                    .andExpect(content().string(newAvatarUrl));

            verify(userService).updateAvatar(anyString(), any(User.class));
        }

        @Test
        @DisplayName("Should handle empty avatar URL")
        void shouldHandleEmptyAvatarUrl() throws Exception {
            // Given
            String emptyAvatarUrl = "";
            when(userService.updateAvatar(anyString(), any(User.class))).thenReturn(emptyAvatarUrl);

            // When & Then
            mockMvc.perform(put("/users/avatar")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(emptyAvatarUrl)))
                    .andExpect(status().isOk())
                    .andExpect(content().string(emptyAvatarUrl));

            verify(userService).updateAvatar(anyString(), any(User.class));
        }
    }

    @Nested
    @DisplayName("Update Nickname Tests")
    class UpdateNicknameTests {

        @Test
        @DisplayName("Should update nickname successfully")
        void shouldUpdateNicknameSuccessfully() throws Exception {
            // Given
            String newNickname = "newusername";
            when(userService.updateNickname(anyString(), any(User.class))).thenReturn(newNickname);

            // Crear el body en el formato esperado por el controlador
            Map<String, String> requestBody = Map.of("nickname", newNickname);

            // When & Then
            mockMvc.perform(put("/users/nickname")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(requestBody)))
                    .andExpect(status().isOk())
                    .andExpect(content().string(newNickname));

            verify(userService).updateNickname(anyString(), any(User.class));
        }

        @Test
        @DisplayName("Should call service with nickname parameter")
        void shouldCallServiceWithNicknameParameter() throws Exception {
            // Given
            String differentNickname = "differentuser";
            when(userService.updateNickname(anyString(), any(User.class))).thenReturn(differentNickname);

            // Crear el body en el formato esperado por el controlador
            Map<String, String> requestBody = Map.of("nickname", differentNickname);

            // When & Then
            mockMvc.perform(put("/users/nickname")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(requestBody)))
                    .andExpect(status().isOk())
                    .andExpect(content().string(differentNickname));

            verify(userService).updateNickname(anyString(), any(User.class));
        }

        @Test
        @DisplayName("Should handle empty nickname")
        void shouldHandleEmptyNickname() throws Exception {
            // Given
            String emptyNickname = "";
            when(userService.updateNickname(anyString(), any(User.class))).thenReturn(emptyNickname);

            // Crear el body en el formato esperado por el controlador
            Map<String, String> requestBody = Map.of("nickname", emptyNickname);

            // When & Then
            mockMvc.perform(put("/users/nickname")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(requestBody)))
                    .andExpect(status().isOk())
                    .andExpect(content().string(emptyNickname));

            verify(userService).updateNickname(anyString(), any(User.class));
        }
    }
}