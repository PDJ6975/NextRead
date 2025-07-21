package com.nextread.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.nextread.dto.SurveyResponseDTO;
import com.nextread.dto.UpdateSurveyRequestDTO;
import com.nextread.entities.User;
import com.nextread.services.SurveyService;

@RequestMapping("/surveys")
@RestController
public class SurveyController {

    private final SurveyService surveyService;

    @Autowired
    public SurveyController(SurveyService surveyService) {
        this.surveyService = surveyService;
    }

    @GetMapping("/find")
    public ResponseEntity<SurveyResponseDTO> getSurvey() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        return ResponseEntity.ok(surveyService.findByUserOrCreate(currentUser));
    }

    @PutMapping("/update")
    public ResponseEntity<SurveyResponseDTO> updateSurveyBasics(@RequestBody UpdateSurveyRequestDTO request) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        try {
            SurveyResponseDTO result = surveyService.updatePaceGenreSurvey(request.getPace(), request.getGenresIds(),
                    currentUser);

            ResponseEntity<SurveyResponseDTO> response = ResponseEntity.ok(result);

            return response;
        } catch (Exception e) {
            System.err.println("💥 Error en updateSurveyBasics: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    // TODO: Actualizar para restricción con rol para admin. Vamos que debe usar el
    // id de la encuesta del usuario y validar que el user es admin, nada de
    // currentUser
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSurvey(@PathVariable Long id) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        surveyService.deleteSurvey(currentUser);

        return ResponseEntity.ok("Encuesta eliminada correctamente para usuario: " + currentUser.getNickname());

    }
}
