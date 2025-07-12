package com.nextread.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.nextread.dto.SurveyResponseDTO;
import com.nextread.entities.PaceSelection;
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
    public ResponseEntity<SurveyResponseDTO> findSurveyByUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        return ResponseEntity.ok(surveyService.findByUserOrCreate(currentUser));
    }

    @PutMapping("/update")
    public ResponseEntity<SurveyResponseDTO> updateSurveyBasics(PaceSelection pace, List<Long> genresIds) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        return ResponseEntity.ok(surveyService.updatePaceGenreSurvey(pace, genresIds, currentUser));
    }

    // TODO: Actualizar para restricción con rol para admin
    @DeleteMapping
    public ResponseEntity<String> deleteSurvey() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        surveyService.deleteSurvey(currentUser);

        return ResponseEntity.ok("Encuesta eliminada correctamente para usuario: " + currentUser.getNickname());

    }
}
