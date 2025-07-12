package com.nextread.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
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

import com.nextread.dto.SurveyResponseDTO;
import com.nextread.entities.Genre;
import com.nextread.entities.GenreSelection;
import com.nextread.entities.PaceSelection;
import com.nextread.entities.Survey;
import com.nextread.entities.User;
import com.nextread.entities.UserBook;
import com.nextread.repositories.SurveyRepository;

@ExtendWith(MockitoExtension.class)
class SurveyServiceTest {

    @Mock
    private SurveyRepository surveyRepository;
    @Mock
    private UserBookService userBookService;
    @Mock
    private GenreService genreService;

    @InjectMocks
    private SurveyService surveyService;

    private User newUser() {
        return new User();
    }

    private Genre sampleGenre(Long id) {
        Genre g = new Genre();
        g.setId(id);
        g.setSelectedGenre(GenreSelection.FANTASY);
        return g;
    }

    private Survey sampleSurvey(boolean firstTime) {
        Survey s = Survey.builder()
                .id(1L)
                .pace(PaceSelection.FAST)
                .selectedGenres(List.of(sampleGenre(1L)))
                .firstTime(firstTime)
                .build();
        return s;
    }

    @Nested
    @DisplayName("findByUserOrCreate")
    class FindOrCreate {
        @Test
        void returnsExistingSurvey() {
            User u = newUser();
            Survey existing = sampleSurvey(false);
            when(surveyRepository.findByUser(u)).thenReturn(Optional.of(existing));
            SurveyResponseDTO dto = surveyService.findByUserOrCreate(u);
            assertEquals(existing.getPace(), dto.getPace());
            verify(surveyRepository, never()).save(any());
        }

        @Test
        void createsWhenMissing() {
            User u = newUser();
            // repository returns empty
            when(surveyRepository.findByUser(u)).thenReturn(Optional.empty());
            // save returns the survey it receives (id set automatically as 1)
            when(surveyRepository.save(any(Survey.class))).thenAnswer(inv -> {
                Survey s = inv.getArgument(0);
                s.setId(99L);
                return s;
            });
            SurveyResponseDTO dto = surveyService.findByUserOrCreate(u);
            assertEquals(99L, dto.getId());
            verify(surveyRepository).save(any());
        }
    }

    @Nested
    @DisplayName("updatePaceGenreSurvey")
    class UpdateSurvey {

        @Test
        void firstTimeRequiresPaceAndGenres() {
            User u = newUser();
            Survey s = sampleSurvey(true);
            when(surveyRepository.findByUser(u)).thenReturn(Optional.of(s));
            assertThrows(RuntimeException.class,
                    () -> surveyService.updatePaceGenreSurvey(null, List.of(), u));
        }

        @Test
        void firstTimeValidUpdate() {
            User u = newUser();
            Survey s = sampleSurvey(true);
            s.setPace(PaceSelection.SLOW);
            s.setSelectedGenres(new ArrayList<>());
            when(surveyRepository.findByUser(u)).thenReturn(Optional.of(s));
            Genre g1 = sampleGenre(10L);
            when(genreService.findById(10L)).thenReturn(g1);
            when(surveyRepository.save(any(Survey.class))).thenAnswer(inv -> inv.getArgument(0));

            SurveyResponseDTO dto = surveyService.updatePaceGenreSurvey(PaceSelection.FAST, List.of(10L), u);
            assertEquals(PaceSelection.FAST, dto.getPace());
            assertEquals(1, dto.getSelectedGenres().size());
        }

        @Test
        void laterUpdateOnlyPace() {
            User u = newUser();
            Survey s = sampleSurvey(false);
            when(surveyRepository.findByUser(u)).thenReturn(Optional.of(s));
            when(surveyRepository.save(any(Survey.class))).thenAnswer(inv -> inv.getArgument(0));
            SurveyResponseDTO dto = surveyService.updatePaceGenreSurvey(PaceSelection.SLOW, null, u);
            assertEquals(PaceSelection.SLOW, dto.getPace());
        }

        @Test
        void laterUpdateOnlyGenres() {
            User u = newUser();
            Survey s = sampleSurvey(false);
            when(surveyRepository.findByUser(u)).thenReturn(Optional.of(s));
            Genre g1 = sampleGenre(5L);
            when(genreService.findById(5L)).thenReturn(g1);
            when(surveyRepository.save(any(Survey.class))).thenAnswer(inv -> inv.getArgument(0));
            SurveyResponseDTO dto = surveyService.updatePaceGenreSurvey(null, List.of(5L), u);
            assertEquals(1, dto.getSelectedGenres().size());
            assertEquals(GenreSelection.FANTASY, dto.getSelectedGenres().get(0));
        }
    }

    @Nested
    @DisplayName("findSurveyByUser")
    class FindByUser {
        @Test
        void surveyFound() {
            Survey s = sampleSurvey(false);
            User u = newUser();
            when(surveyRepository.findByUser(u)).thenReturn(Optional.of(s));
            Survey result = surveyService.findSurveyByUser(u);
            assertEquals(s, result);
        }

        @Test
        void surveyNotFoundThrows() {
            User u = newUser();
            when(surveyRepository.findByUser(u)).thenReturn(Optional.empty());
            assertThrows(RuntimeException.class, () -> surveyService.findSurveyByUser(u));
        }
    }

    @Test
    void hasUserBooks_returnsBoolean() {
        User u = newUser();
        when(userBookService.findUserBooks(u)).thenReturn(List.of(new UserBook()));
        assertTrue(surveyService.hasUserBooks(u));
        when(userBookService.findUserBooks(u)).thenReturn(new ArrayList<>());
        assertFalse(surveyService.hasUserBooks(u));
    }

    @Test
    void deleteSurvey_whenPresent() {
        User u = newUser();
        Survey s = sampleSurvey(false);
        when(surveyRepository.findByUser(u)).thenReturn(Optional.of(s));
        surveyService.deleteSurvey(u);
        verify(surveyRepository).delete(s);
    }

    @Test
    void deleteSurvey_whenMissing() {
        User u = newUser();
        when(surveyRepository.findByUser(u)).thenReturn(Optional.empty());
        surveyService.deleteSurvey(u);
        verify(surveyRepository, never()).delete(any());
    }
}