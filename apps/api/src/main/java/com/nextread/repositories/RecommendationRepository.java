package com.nextread.repositories;

import java.time.Instant;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nextread.entities.Recommendation;
import com.nextread.entities.RecommendationStatus;
import com.nextread.entities.User;
import com.nextread.entities.Book;

/**
 * Repositorio para la entidad Recommendation
 */
@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {

    /**
     * Busca todas las recomendaciones de un usuario
     * 
     * @param user El usuario
     * @return Lista de recomendaciones del usuario
     */
    List<Recommendation> findByRecommendedUser(User user);

    /**
     * Busca recomendaciones de un usuario con un estado específico
     * 
     * @param user   El usuario
     * @param status El estado de la recomendación
     * @return Lista de recomendaciones del usuario con el estado especificado
     */
    List<Recommendation> findByRecommendedUserAndStatus(User user, RecommendationStatus status);

    /**
     * Busca recomendaciones de un usuario con un estado específico creadas después
     * de una fecha
     * 
     * @param user      El usuario
     * @param status    El estado de la recomendación
     * @param createdAt La fecha desde la cual buscar
     * @return Lista de recomendaciones del usuario con el estado especificado
     *         creadas después de la fecha
     */
    List<Recommendation> findByRecommendedUserAndStatusAndCreatedAtAfter(User user, RecommendationStatus status,
            Instant createdAt);

    /**
     * Elimina una recomendación específica para un usuario y libro
     * 
     * @param user El usuario
     * @param book El libro
     */
    void deleteByRecommendedUserAndRecommendedBook(User user, Book book);
}