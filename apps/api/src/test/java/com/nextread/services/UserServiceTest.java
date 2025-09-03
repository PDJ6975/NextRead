package com.nextread.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.nextread.entities.User;
import com.nextread.repositories.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setNickname("testuser");
        testUser.setAvatarUrl("https://example.com/avatar.jpg");
    }

    @Nested
    @DisplayName("Update Avatar Tests")
    class UpdateAvatarTests {

        @Test
        @DisplayName("Should update avatar successfully")
        void shouldUpdateAvatarSuccessfully() {
            // Given
            String newAvatarUrl = "https://example.com/new-avatar.jpg";
            when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // When
            String result = userService.updateAvatar(newAvatarUrl, testUser);

            // Then
            assertEquals(newAvatarUrl, result);
            assertEquals(newAvatarUrl, testUser.getAvatarUrl());
            verify(userRepository).findByEmail(testUser.getEmail());
            verify(userRepository).save(testUser);
        }

        @Test
        @DisplayName("Should handle user not found when updating avatar")
        void shouldHandleUserNotFoundWhenUpdatingAvatar() {
            // Given
            String newAvatarUrl = "https://example.com/new-avatar.jpg";
            when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.empty());

            // When & Then
            RuntimeException exception = assertThrows(RuntimeException.class,
                    () -> userService.updateAvatar(newAvatarUrl, testUser));

            assertEquals("Usuario no encontrado", exception.getMessage());
            verify(userRepository).findByEmail(testUser.getEmail());
            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("Should handle empty avatar URL")
        void shouldHandleEmptyAvatarUrl() {
            // Given
            String emptyAvatarUrl = "";
            when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // When
            String result = userService.updateAvatar(emptyAvatarUrl, testUser);

            // Then
            assertEquals(emptyAvatarUrl, result);
            assertEquals(emptyAvatarUrl, testUser.getAvatarUrl());
            verify(userRepository).findByEmail(testUser.getEmail());
            verify(userRepository).save(testUser);
        }

        @Test
        @DisplayName("Should handle null avatar URL")
        void shouldHandleNullAvatarUrl() {
            // Given
            String nullAvatarUrl = null;
            when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // When
            String result = userService.updateAvatar(nullAvatarUrl, testUser);

            // Then
            assertNull(result);
            assertNull(testUser.getAvatarUrl());
            verify(userRepository).findByEmail(testUser.getEmail());
            verify(userRepository).save(testUser);
        }
    }

    @Nested
    @DisplayName("Update Nickname Tests")
    class UpdateNicknameTests {

        @Test
        @DisplayName("Should update nickname successfully")
        void shouldUpdateNicknameSuccessfully() {
            // Given
            String newNickname = "newusername";
            when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
            when(userRepository.findByNickname(newNickname)).thenReturn(Optional.empty());
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // When
            String result = userService.updateNickname(newNickname, testUser);

            // Then
            assertEquals(newNickname, result);
            assertEquals(newNickname, testUser.getNickname());
            verify(userRepository).findByEmail(testUser.getEmail());
            verify(userRepository).findByNickname(newNickname);
            verify(userRepository).save(testUser);
        }

        @Test
        @DisplayName("Should handle user not found when updating nickname")
        void shouldHandleUserNotFoundWhenUpdatingNickname() {
            // Given
            String newNickname = "newusername";
            when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.empty());

            // When & Then
            RuntimeException exception = assertThrows(RuntimeException.class,
                    () -> userService.updateNickname(newNickname, testUser));

            assertEquals("Usuario no encontrado", exception.getMessage());
            verify(userRepository).findByEmail(testUser.getEmail());
            verify(userRepository, never()).findByNickname(anyString());
            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("Should handle nickname already in use")
        void shouldHandleNicknameAlreadyInUse() {
            // Given
            String existingNickname = "existinguser";
            User existingUser = new User();
            existingUser.setId(2L);
            existingUser.setNickname(existingNickname);

            when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
            when(userRepository.findByNickname(existingNickname)).thenReturn(Optional.of(existingUser));

            // When & Then
            RuntimeException exception = assertThrows(RuntimeException.class,
                    () -> userService.updateNickname(existingNickname, testUser));

            assertEquals("El nickname ya está en uso", exception.getMessage());
            verify(userRepository).findByEmail(testUser.getEmail());
            verify(userRepository).findByNickname(existingNickname);
            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("Should handle empty nickname")
        void shouldHandleEmptyNickname() {
            // Given
            String emptyNickname = "";
            when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
            when(userRepository.findByNickname(emptyNickname)).thenReturn(Optional.empty());
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // When
            String result = userService.updateNickname(emptyNickname, testUser);

            // Then
            assertEquals(emptyNickname, result);
            assertEquals(emptyNickname, testUser.getNickname());
            verify(userRepository).findByEmail(testUser.getEmail());
            verify(userRepository).findByNickname(emptyNickname);
            verify(userRepository).save(testUser);
        }

        @Test
        @DisplayName("Should handle null nickname")
        void shouldHandleNullNickname() {
            // Given
            String nullNickname = null;
            when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
            when(userRepository.findByNickname(nullNickname)).thenReturn(Optional.empty());
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // When
            String result = userService.updateNickname(nullNickname, testUser);

            // Then
            assertNull(result);
            assertNull(testUser.getNickname());
            verify(userRepository).findByEmail(testUser.getEmail());
            verify(userRepository).findByNickname(nullNickname);
            verify(userRepository).save(testUser);
        }

        @Test
        @DisplayName("Should not allow user to keep same nickname due to current service logic")
        void shouldNotAllowUserToKeepSameNickname() {
            // Given
            String currentNickname = testUser.getNickname();
            when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
            when(userRepository.findByNickname(currentNickname)).thenReturn(Optional.of(testUser));

            // When & Then
            RuntimeException exception = assertThrows(RuntimeException.class,
                    () -> userService.updateNickname(currentNickname, testUser));

            assertEquals("El nickname ya está en uso", exception.getMessage());
            verify(userRepository).findByEmail(testUser.getEmail());
            verify(userRepository).findByNickname(currentNickname);
            verify(userRepository, never()).save(any(User.class));
        }
    }
}