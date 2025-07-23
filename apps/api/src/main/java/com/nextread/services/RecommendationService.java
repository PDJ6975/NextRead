package com.nextread.services;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nextread.dto.GeneratedRecommendationDTO;
import com.nextread.entities.Book;
import com.nextread.entities.Recommendation;
import com.nextread.entities.RecommendationStatus;
import com.nextread.entities.User;
import com.nextread.repositories.RecommendationRepository;

@Service
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final BookService bookService;
    private final ChatGPTService chatGPTService;

    @Autowired
    public RecommendationService(RecommendationRepository recommendationRepository,
            BookService bookService,
            @Lazy ChatGPTService chatGPTService) {
        this.recommendationRepository = recommendationRepository;
        this.bookService = bookService;
        this.chatGPTService = chatGPTService;
    }

    /**
     * Obtiene los libros que han sido rechazados recientemente por el usuario.
     * Estos libros se incluirán en el prompt para que la IA los evite.
     * 
     * @param user          El usuario
     * @param daysThreshold Número de días hacia atrás para considerar como
     *                      "reciente"
     * @return Lista de libros rechazados recientemente
     */
    @Transactional(readOnly = true)
    public List<Book> getRecentlyRejectedBooks(User user, int daysThreshold) {
        try {
            System.out.println(
                    "DEBUG: Buscando libros rechazados para usuario: " + user.getEmail() + ", días: " + daysThreshold);

            Instant thresholdDate = Instant.now().minusSeconds(daysThreshold * 24 * 60 * 60);
            System.out.println("DEBUG: Fecha umbral: " + thresholdDate);

            List<Recommendation> rejectedRecommendations = recommendationRepository
                    .findByRecommendedUserAndStatusAndCreatedAtAfter(user, RecommendationStatus.REJECTED,
                            thresholdDate);

            System.out.println("DEBUG: Recomendaciones rechazadas encontradas: " + rejectedRecommendations.size());

            List<Book> result = rejectedRecommendations.stream()
                    .map(Recommendation::getRecommendedBook)
                    .distinct()
                    .collect(Collectors.toList());

            System.out.println("DEBUG: Libros únicos rechazados: " + result.size());
            return result;
        } catch (Exception e) {
            System.out.println("DEBUG: Error en getRecentlyRejectedBooks: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    /**
     * Genera recomendaciones usando ChatGPT basadas en la encuesta del usuario.
     * Las recomendaciones se guardan automáticamente en la base de datos.
     * Incluye libros rechazados recientemente para que la IA los evite.
     * 
     * @param user El usuario autenticado
     * @return Lista de recomendaciones generadas y guardadas
     */
    @Transactional
    public List<GeneratedRecommendationDTO> generateRecommendations(User user) {
        try {
            System.out.println("DEBUG: Iniciando generateRecommendations para usuario: " + user.getEmail());

            // Obtener libros rechazados recientemente (últimos 30 días)
            List<Book> rejectedBooks = getRecentlyRejectedBooks(user, 30);
            System.out.println("DEBUG: Libros rechazados encontrados: " + rejectedBooks.size());

            List<GeneratedRecommendationDTO> result = chatGPTService.generateRecommendations(user, rejectedBooks);
            System.out.println("DEBUG: Recomendaciones generadas: " + (result != null ? result.size() : 0));

            // Guardar automáticamente las recomendaciones generadas
            if (result != null && !result.isEmpty()) {
                for (GeneratedRecommendationDTO recommendation : result) {
                    try {
                        // Buscar o crear el libro usando BookService
                        Book book = bookService.findOrCreateBookFromRecommendation(recommendation);

                        if (book != null) {
                            // Verificar que no exista ya una recomendación para este libro y usuario
                            if (!recommendationExists(user, book)) {
                                // Crear y guardar la recomendación usando el Builder de la entidad
                                Recommendation savedRecommendation = Recommendation.builder()
                                        .recommendedUser(user)
                                        .recommendedBook(book)
                                        .reason(recommendation.getReason())
                                        .build();

                                recommendationRepository.save(savedRecommendation);
                            }
                        }
                    } catch (Exception e) {
                        // Continuar con las siguientes recomendaciones si hay error
                    }
                }
            }

            return result;
        } catch (Exception e) {
            System.out.println("DEBUG: Error en generateRecommendations: " + e.getMessage());
            e.printStackTrace();
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
        // Solo devolver recomendaciones con estado REJECTED (no aceptadas aún)
        return recommendationRepository.findByRecommendedUserAndStatus(user, RecommendationStatus.REJECTED);
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
        Book book = bookService.findBookById(bookId);

        // Verificar que el usuario no tenga ya una recomendación para este libro
        if (recommendationExists(user, book)) {
            throw new RuntimeException("Ya existe una recomendación de este libro para el usuario");
        }

        // Crear la nueva recomendación usando el Builder de la entidad
        Recommendation recommendation = Recommendation.builder()
                .recommendedUser(user)
                .recommendedBook(book)
                .reason(reason)
                .build();

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
     * @throws RuntimeException si no existe
     */
    @Transactional(readOnly = true)
    public Recommendation findRecommendationById(Long id) {
        return recommendationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recomendación no encontrada"));
    }

    /**
     * Actualiza el estado de una recomendación a ACCEPTED cuando el usuario añade
     * el libro
     * 
     * @param user   El usuario
     * @param bookId El ID del libro
     */
    @Transactional
    public void acceptRecommendation(User user, Long bookId) {
        List<Recommendation> userRecommendations = recommendationRepository.findByRecommendedUser(user);

        for (Recommendation recommendation : userRecommendations) {
            if (recommendation.getRecommendedBook().getId().equals(bookId)) {
                recommendation.setStatus(RecommendationStatus.ACCEPTED);
                recommendationRepository.save(recommendation);
                return;
            }
        }
    }

    /**
     * Verifica si ya existe una recomendación para un usuario y libro
     * 
     * @param user El usuario
     * @param book El libro
     * @return true si existe, false en caso contrario
     */
    private boolean recommendationExists(User user, Book book) {
        List<Recommendation> existingRecommendations = recommendationRepository.findByRecommendedUser(user);
        return existingRecommendations.stream()
                .anyMatch(r -> r.getRecommendedBook().getId().equals(book.getId()));
    }
}