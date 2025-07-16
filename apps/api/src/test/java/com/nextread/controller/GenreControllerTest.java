package com.nextread.controller;

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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.nextread.entities.Genre;
import com.nextread.entities.GenreSelection;
import com.nextread.services.GenreService;

@ExtendWith(MockitoExtension.class)
public class GenreControllerTest {

    private MockMvc mockMvc;

    @Mock
    private GenreService genreService;

    private Genre testGenre;

    @BeforeEach
    void setUp() {
        testGenre = new Genre();
        testGenre.setId(1L);
        testGenre.setSelectedGenre(GenreSelection.FANTASY);

        // Configurar MockMvc
        GenreController controller = new GenreController(genreService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Nested
    @DisplayName("Get All Genres Tests")
    class GetAllGenresTests {

        @Test
        @DisplayName("Should return all genres successfully")
        void shouldReturnAllGenresSuccessfully() throws Exception {
            // Given
            Genre genre2 = new Genre();
            genre2.setId(2L);
            genre2.setSelectedGenre(GenreSelection.SCIENCE_FICTION);

            List<Genre> expectedGenres = List.of(testGenre, genre2);
            when(genreService.findAllGenres()).thenReturn(expectedGenres);

            // When & Then
            mockMvc.perform(get("/genres")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(2))
                    .andExpect(jsonPath("$[0].id").value(1))
                    .andExpect(jsonPath("$[0].selectedGenre").value("FANTASY"))
                    .andExpect(jsonPath("$[1].id").value(2))
                    .andExpect(jsonPath("$[1].selectedGenre").value("SCIENCE_FICTION"));

            verify(genreService).findAllGenres();
        }

        @Test
        @DisplayName("Should return empty list when no genres exist")
        void shouldReturnEmptyListWhenNoGenresExist() throws Exception {
            // Given
            when(genreService.findAllGenres()).thenReturn(List.of());

            // When & Then
            mockMvc.perform(get("/genres")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(0));

            verify(genreService).findAllGenres();
        }
    }

    @Nested
    @DisplayName("Get Genre By Id Tests")
    class GetGenreByIdTests {

        @Test
        @DisplayName("Should return genre by id successfully")
        void shouldReturnGenreByIdSuccessfully() throws Exception {
            // Given
            when(genreService.findById(1L)).thenReturn(testGenre);

            // When & Then
            mockMvc.perform(get("/genres/1")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(1))
                    .andExpect(jsonPath("$.selectedGenre").value("FANTASY"));

            verify(genreService).findById(1L);
        }

        @Test
        @DisplayName("Should call service with correct id")
        void shouldCallServiceWithCorrectId() throws Exception {
            // Given
            Genre anotherGenre = new Genre();
            anotherGenre.setId(5L);
            anotherGenre.setSelectedGenre(GenreSelection.MYSTERY);

            when(genreService.findById(5L)).thenReturn(anotherGenre);

            // When & Then
            mockMvc.perform(get("/genres/5")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(5))
                    .andExpect(jsonPath("$.selectedGenre").value("MYSTERY"));

            verify(genreService).findById(5L);
        }
    }
}