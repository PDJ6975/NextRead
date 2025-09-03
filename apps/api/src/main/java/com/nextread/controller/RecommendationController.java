package com.nextread.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nextread.dto.GeneratedRecommendationDTO;
import com.nextread.dto.RecommendationRequestDTO;
import com.nextread.entities.Recommendation;
import com.nextread.entities.User;
import com.nextread.services.RecommendationService;
import com.nextread.services.RateLimitService;

import jakarta.validation.Valid;

@RequestMapping("/recommendations")
@RestController
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final RateLimitService rateLimitService;

    @Autowired
    public RecommendationController(RecommendationService recommendationService,
                                   RateLimitService rateLimitService) {
        this.recommendationService = recommendationService;
        this.rateLimitService = rateLimitService;
    }

    /**
     * Genera recomendaciones usando ChatGPT basadas en la encuesta del usuario.
     * 
     * @return Lista de recomendaciones generadas (no guardadas)
     */
    @PostMapping("/generate")
    public ResponseEntity<?> generateRecommendations() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = (User) authentication.getPrincipal();

            if (!rateLimitService.canMakeRequest(currentUser)) {
                int remainingRequests = rateLimitService.getRemainingRequests(currentUser);
                return ResponseEntity.status(429)
                        .body(Map.of(
                                "error", "Límite de recomendaciones diarias alcanzado",
                                "message", "Has alcanzado el límite de recomendaciones para hoy. Inténtalo mañana.",
                                "remainingRequests", remainingRequests,
                                "resetTime", "24 horas"
                        ));
            }

            rateLimitService.recordRequest(currentUser);

            List<GeneratedRecommendationDTO> recommendations = recommendationService
                    .generateRecommendations(currentUser);

            return ResponseEntity.ok(recommendations);

        } catch (Exception e) {
            throw e;
        }
    }

    /**
     * Obtiene todas las recomendaciones del usuario autenticado.
     * 
     * @return Lista de recomendaciones del usuario
     */
    @GetMapping
    public ResponseEntity<List<Recommendation>> getRecommendations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        List<Recommendation> recommendations = recommendationService.getRecommendationsForUser(currentUser);
        return ResponseEntity.ok(recommendations);
    }

    /**
     * Crea una nueva recomendación para el usuario autenticado.
     * 
     * @param request Datos de la recomendación (bookId y reason)
     * @return La recomendación creada
     */
    @PostMapping
    public ResponseEntity<Recommendation> createRecommendation(@Valid @RequestBody RecommendationRequestDTO request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        Recommendation recommendation = recommendationService.createRecommendation(
                currentUser,
                request.getBookId(),
                request.getReason());
        return ResponseEntity.ok(recommendation);
    }

    /**
     * Elimina una recomendación específica del usuario autenticado.
     * 
     * @param id ID de la recomendación a eliminar
     * @return Respuesta de confirmación
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRecommendation(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        recommendationService.deleteRecommendation(id, currentUser);
        return ResponseEntity.ok("Recomendación eliminada correctamente");
    }
}