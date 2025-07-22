package com.nextread.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nextread.dto.GeneratedRecommendationDTO;
import com.nextread.entities.Book;
import com.nextread.entities.Recommendation;
import com.nextread.entities.User;
import com.nextread.repositories.BookRepository;
import com.nextread.repositories.RecommendationRepository;

@Service
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final BookRepository bookRepository;
    private final ChatGPTService chatGPTService;

    @Autowired
    public RecommendationService(RecommendationRepository recommendationRepository,
            BookRepository bookRepository,
            ChatGPTService chatGPTService) {
        this.recommendationRepository = recommendationRepository;
        this.bookRepository = bookRepository;
        this.chatGPTService = chatGPTService;
    }

    /**
     * Genera recomendaciones usando ChatGPT basadas en la encuesta del usuario.
     * 
     * @param user El usuario autenticado
     * @return Lista de recomendaciones generadas (no guardadas)
     */
    @Transactional(readOnly = true)
    public List<GeneratedRecommendationDTO> generateRecommendations(User user) {
        System.out.println(
                "🔧 [RecommendationService] Iniciando generateRecommendations para usuario: " + user.getEmail());

        try {
            List<GeneratedRecommendationDTO> result = chatGPTService.generateRecommendations(user);
            System.out.println("🔧 [RecommendationService] ChatGPTService devolvió: "
                    + (result != null ? result.size() : 0) + " recomendaciones");
            return result;
        } catch (Exception e) {
            System.err.println(
                    "💥 [RecommendationService] Error: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            throw e;
        }
    }

    /**
     * Obtiene todas las recomendaciones de un usuario.
     * 
     * @param user El usuario autenticado
     * @return Lista de recomendaciones del usuario
     */
    @Transactional(readOnly = true)
    public List<Recommendation> getRecommendationsForUser(User user) {
        return recommendationRepository.findByRecommendedUser(user);
    }

    /**
     * Crea una nueva recomendación para un usuario.
     * 
     * @param user   El usuario para quien se crea la recomendación
     * @param bookId El ID del libro recomendado
     * @param reason La razón de la recomendación
     * @return La recomendación creada
     * @throws RuntimeException si el libro no existe
     */
    @Transactional
    public Recommendation createRecommendation(User user, Long bookId, String reason) {
        // Verificar que el libro existe
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Libro no encontrado"));

        // Verificar que el usuario no tenga ya una recomendación para este libro
        List<Recommendation> existingRecommendations = recommendationRepository.findByRecommendedUser(user);
        boolean recommendationExists = existingRecommendations.stream()
                .anyMatch(r -> r.getRecommendedBook().getId().equals(bookId));

        if (recommendationExists) {
            throw new RuntimeException("Ya existe una recomendación de este libro para el usuario");
        }

        // Crear la nueva recomendación
        Recommendation recommendation = new Recommendation();
        recommendation.setRecommendedUser(user);
        recommendation.setRecommendedBook(book);
        recommendation.setReason(reason);

        return recommendationRepository.save(recommendation);
    }

    /**
     * Elimina una recomendación específica.
     * 
     * @param id   El ID de la recomendación a eliminar
     * @param user El usuario autenticado (para verificar permisos)
     * @throws RuntimeException si la recomendación no existe o no pertenece al
     *                          usuario
     */
    @Transactional
    public void deleteRecommendation(Long id, User user) {
        Recommendation recommendation = recommendationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recomendación no encontrada"));

        // Verificar que la recomendación pertenece al usuario
        if (!recommendation.getRecommendedUser().getId().equals(user.getId())) {
            throw new RuntimeException("No tienes permisos para eliminar esta recomendación");
        }

        recommendationRepository.delete(recommendation);
    }

    /**
     * Elimina una recomendación por usuario y libro.
     * 
     * @param user El usuario
     * @param book El libro
     */
    @Transactional
    public void deleteRecommendationByUserAndBook(User user, Book book) {
        recommendationRepository.deleteByRecommendedUserAndRecommendedBook(user, book);
    }

    /**
     * Busca una recomendación por ID.
     * 
     * @param id El ID de la recomendación
     * @return La recomendación encontrada
     * @throws RuntimeException si la recomendación no existe
     */
    @Transactional(readOnly = true)
    public Recommendation findRecommendationById(Long id) {
        return recommendationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recomendación no encontrada"));
    }
}