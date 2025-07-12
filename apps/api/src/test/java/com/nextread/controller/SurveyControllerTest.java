package com.nextread.controller;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
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
import com.nextread.dto.SurveyResponseDTO;
import com.nextread.dto.UpdateSurveyRequestDTO;
import com.nextread.entities.GenreSelection;
import com.nextread.entities.PaceSelection;
import com.nextread.entities.User;
import com.nextread.services.SurveyService;

@ExtendWith(MockitoExtension.class)
class SurveyControllerTest {

    @Mock
    private SurveyService surveyService;

    private MockMvc mockMvc;

    private final ObjectMapper mapper = new ObjectMapper();

    private SurveyResponseDTO sampleDto() {
        return SurveyResponseDTO.builder()
                .id(1L)
                .pace(PaceSelection.FAST)
                .selectedGenres(List.of(GenreSelection.FANTASY))
                .build();
    }

    @BeforeEach
    void setup() {
        SurveyController ctrl = new SurveyController(surveyService);
        mockMvc = MockMvcBuilders.standaloneSetup(ctrl).build();
    }

    private void setAuth() {
        User u = new User();
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(u, null, List.of()));
    }

    @Test
    @DisplayName("GET /surveys/find")
    void findSurvey() throws Exception {
        setAuth();
        when(surveyService.findByUserOrCreate(any())).thenReturn(sampleDto());
        mockMvc.perform(get("/surveys/find"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)));
    }

    @Test
    @DisplayName("PUT /surveys/update")
    void updateSurvey() throws Exception {
        setAuth();
        UpdateSurveyRequestDTO req = UpdateSurveyRequestDTO.builder()
                .pace(PaceSelection.SLOW)
                .genresIds(List.of(1L, 2L))
                .build();
        when(surveyService.updatePaceGenreSurvey(eq(PaceSelection.SLOW), eq(List.of(1L, 2L)), any()))
                .thenReturn(sampleDto());

        mockMvc.perform(put("/surveys/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pace", is("FAST")));
    }

    @Test
    @DisplayName("DELETE /surveys")
    void deleteSurvey() throws Exception {
        setAuth();
        mockMvc.perform(delete("/surveys"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Encuesta eliminada correctamente")));
        verify(surveyService).deleteSurvey(any());
    }
}