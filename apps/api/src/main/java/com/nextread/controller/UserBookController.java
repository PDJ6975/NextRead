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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nextread.dto.UserBookDTO;
import com.nextread.dto.AddBookRequestDTO;
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

        List<UserBookDTO> userBooks = userBookService.findUserBooksAsDTO(currentUser);
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

        UserBookDTO userBook = userBookService.findUserBookByIdAsDTO(id, currentUser);
        return ResponseEntity.ok(userBook);
    }

    /**
     * Actualiza el rating y status de un libro del usuario.
     * 
     * @param id          ID del UserBook
     * @param userBookDTO Datos a actualizar (rating, status, startedAt, finishedAt)
     * @return UserBookDTO actualizado
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserBookDTO> updateUserBook(@PathVariable Long id, @RequestBody UserBookDTO userBookDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        UserBookDTO updatedUserBook = userBookService.updateUserBook(id, currentUser, userBookDTO);
        return ResponseEntity.ok(updatedUserBook);
    }

    /**
     * Elimina un libro de la lista del usuario.
     * 
     * @param id ID del UserBook
     * @return Respuesta de confirmación
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUserBook(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        userBookService.deleteUserBook(id, currentUser);
        return ResponseEntity.ok("Libro eliminado de tu lista correctamente");
    }

    @PostMapping
    public ResponseEntity<UserBookDTO> addBookToUserList(@RequestBody AddBookRequestDTO request) {

        System.out.println("📚 UserBookController.addBookToUserList - Iniciando adición de libro");
        System.out.println("📚 Request recibido: " + request);
        System.out.println("📚 Book: " + request.getBook());
        System.out.println("📚 UserBookDTO: " + request.getUserBookDTO());

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        System.out.println("📚 Usuario autenticado: " + currentUser.getEmail());

        try {
            UserBookDTO result = userBookService.addBookSelected(request.getBook(), request.getUserBookDTO(),
                    currentUser);
            System.out.println("📚 Resultado del servicio: " + result);

            ResponseEntity<UserBookDTO> response = ResponseEntity.ok(result);
            System.out.println("📚 Respuesta a enviar: " + response);

            return response;
        } catch (Exception e) {
            System.err.println("💥 Error en addBookToUserList: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}