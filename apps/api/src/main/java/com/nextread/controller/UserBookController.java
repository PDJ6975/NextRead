package com.nextread.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nextread.dto.UserBookDTO;
import com.nextread.entities.User;
import com.nextread.services.UserBookService;

@RequestMapping("/userbooks")
@RestController
public class UserBookController {

    private final UserBookService userBookService;

    @Autowired
    public UserBookController(UserBookService userBookService) {
        this.userBookService = userBookService;
    }

    /**
     * Lista todos los libros del usuario autenticado (sus lecturas actuales).
     * 
     * @return Lista de UserBookDTO del usuario
     */
    @GetMapping
    public ResponseEntity<List<UserBookDTO>> getUserBooks() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        List<UserBookDTO> userBooks = userBookService.findUserBooks(currentUser);
        return ResponseEntity.ok(userBooks);
    }

    /**
     * Obtiene un libro específico del usuario autenticado.
     * 
     * @param id ID del UserBook
     * @return UserBookDTO específico del usuario
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserBookDTO> getUserBookById(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        UserBookDTO userBook = userBookService.findUserBookById(id, currentUser);
        return ResponseEntity.ok(userBook);
    }
}