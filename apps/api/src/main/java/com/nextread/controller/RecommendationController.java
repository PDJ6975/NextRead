package com.nextread.controller;

import java.util.List;

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

import jakarta.validation.Valid;

@RequestMapping("/recommendations")
@RestController
public class RecommendationController {

    private final RecommendationService recommendationService;

    @Autowired
    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    /**
     * Genera recomendaciones usando ChatGPT basadas en la encuesta del usuario.
     * 
     * @return Lista de recomendaciones generadas (no guardadas)
     */
    @PostMapping("/generate")
    public ResponseEntity<List<GeneratedRecommendationDTO>> generateRecommendations() {
        System.out.println("🚀 [DEBUG] Iniciando generación de recomendaciones...");

        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("🔐 [DEBUG] Authentication obtenido: " + (authentication != null ? "OK" : "NULL"));

            if (authentication == null) {
                System.err.println("❌ [ERROR] Authentication es null");
                throw new RuntimeException("Usuario no autenticado");
            }

            User currentUser = (User) authentication.getPrincipal();
            System.out.println("👤 [DEBUG] Usuario actual: " + (currentUser != null ? currentUser.getEmail() : "NULL"));
            System.out.println("👤 [DEBUG] Usuario ID: " + (currentUser != null ? currentUser.getId() : "NULL"));

            if (currentUser == null) {
                System.err.println("❌ [ERROR] CurrentUser es null");
                throw new RuntimeException("Usuario no válido");
            }

            System.out.println("📞 [DEBUG] Llamando a recommendationService.generateRecommendations...");
            List<GeneratedRecommendationDTO> recommendations = recommendationService
                    .generateRecommendations(currentUser);

            System.out.println("✅ [DEBUG] Recomendaciones generadas exitosamente");
            System.out.println(
                    "📊 [DEBUG] Número de recomendaciones: " + (recommendations != null ? recommendations.size() : 0));

            if (recommendations != null && !recommendations.isEmpty()) {
                System.out.println("📝 [DEBUG] Primera recomendación: " + recommendations.get(0).getTitle());
            }

            return ResponseEntity.ok(recommendations);

        } catch (Exception e) {
            System.err.println("💥 [ERROR] Error en generateRecommendations: " + e.getClass().getSimpleName());
            System.err.println("💥 [ERROR] Mensaje: " + e.getMessage());
            System.err.println("💥 [ERROR] Stack trace:");
            e.printStackTrace();

            // Re-throw para que Spring maneje la respuesta HTTP
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