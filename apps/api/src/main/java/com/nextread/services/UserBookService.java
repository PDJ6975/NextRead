package com.nextread.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import com.nextread.dto.UserBookDTO;
import com.nextread.entities.Book;
import com.nextread.entities.User;
import com.nextread.entities.UserBook;
import com.nextread.repositories.UserBookRepository;

import org.springframework.transaction.annotation.Transactional;
import com.nextread.entities.Survey;

@Service
public class UserBookService {

    private final UserBookRepository userBookRepository;
    private final BookService bookService;
    private final SurveyService surveyService;
    private final RecommendationService recommendationService;

    @Autowired
    public UserBookService(UserBookRepository userBookRepository, BookService bookService,
            SurveyService surveyService, @Lazy RecommendationService recommendationService) {
        this.userBookRepository = userBookRepository;
        this.bookService = bookService;
        this.surveyService = surveyService;
        this.recommendationService = recommendationService;
    }

    /**
     * Obtiene todos los libros del usuario autenticado.
     * 
     * @param user El usuario autenticado
     * @return Lista de UserBook del usuario
     */
    @Transactional(readOnly = true)
    public List<UserBook> findUserBooks(User user) {
        return userBookRepository.findByUser(user);
    }

    /**
     * Obtiene todos los libros del usuario autenticado como DTOs.
     * 
     * @param user El usuario autenticado
     * @return Lista de UserBookDTO del usuario
     */
    @Transactional(readOnly = true)
    public List<UserBookDTO> findUserBooksAsDTO(User user) {
        List<UserBook> userBooks = userBookRepository.findByUser(user);
        return userBooks.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene un UserBook específico del usuario.
     * 
     * @param id   ID del UserBook
     * @param user El usuario autenticado
     * @return UserBook encontrado o excepción si no existe
     */
    @Transactional(readOnly = true)
    public UserBook findUserBookById(Long id, User user) {
        return userBookRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Libro del usuario no encontrado"));
    }

    /**
     * Obtiene un UserBook específico del usuario como DTO.
     * 
     * @param id   ID del UserBook
     * @param user El usuario autenticado
     * @return UserBookDTO encontrado o excepción si no existe
     */
    @Transactional(readOnly = true)
    public UserBookDTO findUserBookByIdAsDTO(Long id, User user) {
        UserBook userBook = findUserBookById(id, user);
        return convertToDTO(userBook);
    }

    /**
     * Actualiza un UserBook del usuario.
     * 
     * @param id          ID del UserBook
     * @param user        El usuario autenticado
     * @param userBookDTO Datos a actualizar
     * @return UserBookDTO actualizado
     */
    @Transactional
    public UserBookDTO updateUserBook(Long id, User user, UserBookDTO userBookDTO) {
        UserBook userBook = findUserBookById(id, user);

        // Actualizar solo los campos permitidos
        if (userBookDTO.getRating() != null) {
            userBook.setRating(userBookDTO.getRating());
        }
        if (userBookDTO.getStatus() != null) {
            userBook.setStatus(userBookDTO.getStatus());
        }
        if (userBookDTO.getStartedAt() != null) {
            userBook.setStartedAt(userBookDTO.getStartedAt());
        }
        if (userBookDTO.getFinishedAt() != null) {
            userBook.setFinishedAt(userBookDTO.getFinishedAt());
        }

        UserBook savedUserBook = userBookRepository.save(userBook);
        return convertToDTO(savedUserBook);
    }

    @Transactional
    public UserBookDTO addBookSelected(Book book, UserBookDTO userBookDTO, User user) {

        // Si no tiene id, viene de google y hay que añadirlo a la BD
        final Book bookToSave = book.getId() == null ? bookService.saveBook(book) : book;

        // Verificar si el usuario ya tiene este libro
        List<UserBook> existingUserBooks = userBookRepository.findByUser(user);
        boolean bookAlreadyExists = existingUserBooks.stream()
                .anyMatch(ub -> ub.getBook().getId().equals(bookToSave.getId()));

        if (bookAlreadyExists) {
            throw new RuntimeException("El usuario ya tiene este libro en su lista");
        }

        // Crear la nueva relación UserBook
        UserBook newBookForUser = UserBook.builder().user(user).book(bookToSave).build();
        userBookRepository.save(newBookForUser);

        // Si es la primera vez que añade un libro, marcar encuesta como completada
        Survey survey = surveyService.findSurveyByUser(user);
        if (Boolean.TRUE.equals(survey.getFirstTime())) {
            survey.setFirstTime(false);
            surveyService.saveSurvey(survey);
        }

        // Actualizar con los datos del DTO si se proporcionan
        UserBookDTO updatedUserBook = updateUserBook(newBookForUser.getId(), user, userBookDTO);

        // Aceptar la recomendación si existe para este libro
        try {
            recommendationService.acceptRecommendation(user, bookToSave.getId());
        } catch (Exception e) {
            // No es crítico si falla la aceptación de recomendación
            System.out.println(
                    "⚠️ [UserBookService] No se pudo aceptar recomendación para libro: " + bookToSave.getTitle());
        }

        return updatedUserBook;
    }

    /**
     * Elimina un UserBook del usuario.
     * 
     * @param id   ID del UserBook
     * @param user El usuario autenticado
     */
    @Transactional
    public void deleteUserBook(Long id, User user) {
        UserBook userBook = findUserBookById(id, user);
        userBookRepository.delete(userBook);
    }

    /**
     * Convierte un UserBook a UserBookDTO.
     * 
     * @param userBook La entidad UserBook
     * @return UserBookDTO con todos los datos del UserBook y Book completo
     */
    private UserBookDTO convertToDTO(UserBook userBook) {
        return UserBookDTO.builder()
                // Datos del UserBook
                .id(userBook.getId())
                .rating(userBook.getRating())
                .status(userBook.getStatus())
                .createdAt(userBook.getCreatedAt())
                .startedAt(userBook.getStartedAt())
                .finishedAt(userBook.getFinishedAt())

                // Datos completos del Book
                .bookId(userBook.getBook().getId())
                .build();
    }
}