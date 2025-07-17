package com.nextread.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.nextread.entities.Genre;
import com.nextread.entities.GenreSelection;
import com.nextread.repositories.GenreRepository;

@ExtendWith(MockitoExtension.class)
class GenreServiceTest {

    @Mock
    private GenreRepository genreRepository;

    @InjectMocks
    private GenreService genreService;

    private Genre createGenre(Long id, GenreSelection selection) {
        Genre genre = new Genre();
        genre.setId(id);
        genre.setSelectedGenre(selection);
        return genre;
    }

    @Nested
    @DisplayName("Find Genre by ID Tests")
    class FindByIdTests {

        @Test
        @DisplayName("Should find genre by ID successfully")
        void shouldFindGenreByIdSuccessfully() {
            // Given
            Long genreId = 1L;
            Genre expectedGenre = createGenre(genreId, GenreSelection.FANTASY);
            when(genreRepository.findById(genreId)).thenReturn(Optional.of(expectedGenre));

            // When
            Genre result = genreService.findById(genreId);

            // Then
            assertNotNull(result);
            assertEquals(genreId, result.getId());
            assertEquals(GenreSelection.FANTASY, result.getSelectedGenre());
            verify(genreRepository).findById(genreId);
        }

        @Test
        @DisplayName("Should throw exception when genre not found")
        void shouldThrowExceptionWhenGenreNotFound() {
            // Given
            Long genreId = 999L;
            when(genreRepository.findById(genreId)).thenReturn(Optional.empty());

            // When & Then
            RuntimeException exception = assertThrows(RuntimeException.class,
                    () -> genreService.findById(genreId));

            assertEquals("Género no encontrado", exception.getMessage());
            verify(genreRepository).findById(genreId);
        }

        @SuppressWarnings("null")
        @Test
        @DisplayName("Should handle null ID")
        void shouldHandleNullId() {
            // Given
            Long nullId = null;
            when(genreRepository.findById(any())).thenReturn(Optional.empty());

            // When & Then
            RuntimeException exception = assertThrows(RuntimeException.class,
                    () -> genreService.findById(nullId));

            assertEquals("Género no encontrado", exception.getMessage());
            verify(genreRepository).findById(nullId);
        }

        @Test
        @DisplayName("Should find different genre types")
        void shouldFindDifferentGenreTypes() {
            // Given
            Long sciFiId = 2L;
            Genre sciFiGenre = createGenre(sciFiId, GenreSelection.SCIENCE_FICTION);
            when(genreRepository.findById(sciFiId)).thenReturn(Optional.of(sciFiGenre));

            // When
            Genre result = genreService.findById(sciFiId);

            // Then
            assertNotNull(result);
            assertEquals(sciFiId, result.getId());
            assertEquals(GenreSelection.SCIENCE_FICTION, result.getSelectedGenre());
            verify(genreRepository).findById(sciFiId);
        }
    }

    @Nested
    @DisplayName("Find All Genres Tests")
    class FindAllGenresTests {

        @Test
        @DisplayName("Should return all genres successfully")
        void shouldReturnAllGenresSuccessfully() {
            // Given
            List<Genre> expectedGenres = List.of(
                    createGenre(1L, GenreSelection.FANTASY),
                    createGenre(2L, GenreSelection.SCIENCE_FICTION),
                    createGenre(3L, GenreSelection.ROMANCE),
                    createGenre(4L, GenreSelection.THRILLER));
            when(genreRepository.findAll()).thenReturn(expectedGenres);

            // When
            List<Genre> result = genreService.findAllGenres();

            // Then
            assertNotNull(result);
            assertEquals(4, result.size());
            assertEquals(expectedGenres.get(0).getId(), result.get(0).getId());
            assertEquals(expectedGenres.get(0).getSelectedGenre(), result.get(0).getSelectedGenre());
            assertEquals(expectedGenres.get(1).getId(), result.get(1).getId());
            assertEquals(expectedGenres.get(1).getSelectedGenre(), result.get(1).getSelectedGenre());
            verify(genreRepository).findAll();
        }

        @Test
        @DisplayName("Should return empty list when no genres exist")
        void shouldReturnEmptyListWhenNoGenresExist() {
            // Given
            when(genreRepository.findAll()).thenReturn(new ArrayList<>());

            // When
            List<Genre> result = genreService.findAllGenres();

            // Then
            assertNotNull(result);
            assertTrue(result.isEmpty());
            verify(genreRepository).findAll();
        }

        @Test
        @DisplayName("Should return single genre in list")
        void shouldReturnSingleGenreInList() {
            // Given
            Genre singleGenre = createGenre(1L, GenreSelection.MYSTERY);
            when(genreRepository.findAll()).thenReturn(List.of(singleGenre));

            // When
            List<Genre> result = genreService.findAllGenres();

            // Then
            assertNotNull(result);
            assertEquals(1, result.size());
            assertEquals(singleGenre.getId(), result.get(0).getId());
            assertEquals(singleGenre.getSelectedGenre(), result.get(0).getSelectedGenre());
            verify(genreRepository).findAll();
        }

        @Test
        @DisplayName("Should handle repository returning null")
        void shouldHandleRepositoryReturningNull() {
            // Given
            when(genreRepository.findAll()).thenReturn(null);

            // When & Then
            assertThrows(NullPointerException.class, () -> genreService.findAllGenres());
            verify(genreRepository).findAll();
        }

        @Test
        @DisplayName("Should return all available genre types")
        void shouldReturnAllAvailableGenreTypes() {
            // Given
            List<Genre> allGenreTypes = List.of(
                    createGenre(1L, GenreSelection.FANTASY),
                    createGenre(2L, GenreSelection.SCIENCE_FICTION),
                    createGenre(3L, GenreSelection.ROMANCE),
                    createGenre(4L, GenreSelection.THRILLER),
                    createGenre(5L, GenreSelection.MYSTERY),
                    createGenre(6L, GenreSelection.HORROR),
                    createGenre(7L, GenreSelection.HISTORICAL_FICTION),
                    createGenre(8L, GenreSelection.NON_FICTION));
            when(genreRepository.findAll()).thenReturn(allGenreTypes);

            // When
            List<Genre> result = genreService.findAllGenres();

            // Then
            assertNotNull(result);
            assertEquals(8, result.size());

            // Verify specific genres are present
            assertTrue(result.stream().anyMatch(g -> g.getSelectedGenre() == GenreSelection.FANTASY));
            assertTrue(result.stream().anyMatch(g -> g.getSelectedGenre() == GenreSelection.SCIENCE_FICTION));
            assertTrue(result.stream().anyMatch(g -> g.getSelectedGenre() == GenreSelection.ROMANCE));
            assertTrue(result.stream().anyMatch(g -> g.getSelectedGenre() == GenreSelection.THRILLER));
            assertTrue(result.stream().anyMatch(g -> g.getSelectedGenre() == GenreSelection.MYSTERY));
            assertTrue(result.stream().anyMatch(g -> g.getSelectedGenre() == GenreSelection.HORROR));
            assertTrue(result.stream().anyMatch(g -> g.getSelectedGenre() == GenreSelection.HISTORICAL_FICTION));
            assertTrue(result.stream().anyMatch(g -> g.getSelectedGenre() == GenreSelection.NON_FICTION));

            verify(genreRepository).findAll();
        }
    }
}