package com.nextread.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.nextread.entities.Book;
import com.nextread.entities.User;
import com.nextread.services.BookService;

@RequestMapping("/books")
@RestController
public class BookController {

    private final BookService bookService;

    @Autowired
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // TODO: Debemos restringir este método a rol admin. Queda por ver si hay que
    // implementar los roles
    @GetMapping
    public ResponseEntity<List<Book>> findAllBooks() {
        List<Book> books = bookService.findAllBooks();
        return ResponseEntity.ok(books);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> findBookById(@PathVariable Long id) {
        Book book = bookService.findBookById(id);
        return ResponseEntity.ok(book);
    }

    @GetMapping("/search/basic")
    public ResponseEntity<List<Book>> findBookByTitleAlways(@RequestParam String title) {
        return ResponseEntity.ok(bookService.findBooks(title));
    }

    @GetMapping("/search/survey")
    public ResponseEntity<List<Book>> findBookByTitleForSurvey(@RequestParam String title) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        return ResponseEntity.ok(bookService.findBookCauseSurvey(title, currentUser));
    }
}
