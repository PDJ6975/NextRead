package com.nextread.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nextread.dto.UserBookDTO;
import com.nextread.entities.Book;
import com.nextread.entities.User;
import com.nextread.entities.UserBook;
import com.nextread.repositories.UserBookRepository;

import org.springframework.transaction.annotation.Transactional;

@Service
public class UserBookService {

    private final UserBookRepository userBookRepository;
    private final BookService bookService;

    @Autowired
    public UserBookService(UserBookRepository userBookRepository, BookService bookService) {
        this.userBookRepository = userBookRepository;
        this.bookService = bookService;
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

        if (book.getId() == null) {
            bookService.saveBook(book);
        }

        // Si tiene id, o ya lo hemos guardado, solo queda añadir la relacion UserBook,
        // permitiendo update del rating, status, etc.

        UserBook newBookForUser = UserBook.builder().user(user).book(book).build();
        userBookRepository.save(newBookForUser);
        UserBookDTO updatedUserBook = updateUserBook(newBookForUser.getId(), user, userBookDTO);
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