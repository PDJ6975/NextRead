package com.nextread.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nextread.dto.UserBookDTO;
import com.nextread.entities.User;
import com.nextread.entities.UserBook;
import com.nextread.repositories.UserBookRepository;

import jakarta.transaction.Transactional;

@Service
public class UserBookService {

    private final UserBookRepository userBookRepository;

    @Autowired
    public UserBookService(UserBookRepository userBookRepository) {
        this.userBookRepository = userBookRepository;
    }

    /**
     * Obtiene todos los libros del usuario autenticado como DTOs.
     * 
     * @param user El usuario autenticado
     * @return Lista de UserBookDTO del usuario
     */
    @Transactional
    public List<UserBookDTO> findUserBooks(User user) {
        List<UserBook> userBooks = userBookRepository.findByUser(user);
        return userBooks.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene un UserBook específico del usuario como DTO.
     * 
     * @param id   ID del UserBook
     * @param user El usuario autenticado
     * @return UserBookDTO encontrado o excepción si no existe
     */
    @Transactional
    public UserBookDTO findUserBookById(Long id, User user) {
        UserBook userBook = userBookRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Libro del usuario no encontrado"));
        return convertToDTO(userBook);
    }

    /**
     * Convierte un UserBook a UserBookDTO.
     * 
     * @param userBook La entidad UserBook
     * @return UserBookDTO con todos los datos del UserBook y el id del Book para
     *         llamar despues a su endpoint y recuperar su información
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
                // Dato mínimo del Book
                .bookId(userBook.getBook().getId())
                .build();
    }
}