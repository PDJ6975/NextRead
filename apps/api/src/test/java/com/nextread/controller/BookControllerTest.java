package com.nextread.controller;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import com.nextread.entities.Author;
import com.nextread.entities.Book;
import com.nextread.entities.User;
import com.nextread.services.BookService;

@ExtendWith(MockitoExtension.class)
class BookControllerTest {

    private MockMvc mockMvc;

    @Mock
    private BookService bookService;

    private BookController controller;

    private Book sampleBook() {
        return Book.builder()
                .id(1L)
                .title("Title")
                .isbn10("1234567890")
                .isbn13("1234567890123")
                .publisher("Pub")
                .coverUrl("url")
                .synopsis("syn")
                .pages(10)
                .publishedYear("2024")
                .authors(List.of(Author.builder().name("John").build()))
                .build();
    }

    @BeforeEach
    void setup() {
        controller = new BookController(bookService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    @DisplayName("GET /books")
    void getAllBooks() throws Exception {
        when(bookService.findAllBooks()).thenReturn(List.of(sampleBook()));
        mockMvc.perform(get("/books"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title", is("Title")));
    }

    @Test
    @DisplayName("GET /books/{id}")
    void getBookById() throws Exception {
        when(bookService.findBookById(1L)).thenReturn(sampleBook());
        mockMvc.perform(get("/books/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)));
    }

    @Test
    @DisplayName("GET /books/search")
    void searchBooks() throws Exception {
        when(bookService.findBooks("java")).thenReturn(List.of(sampleBook()));
        mockMvc.perform(get("/books/search").param("title", "java"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title", is("Title")));
    }

    @Test
    @DisplayName("GET /books/search/survey")
    void searchSurvey() throws Exception {
        // Preparar contexto de seguridad con un User como principal
        User user = new User();
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(user, null, List.of()));

        when(bookService.findBookCauseSurvey("java", user)).thenReturn(List.of(sampleBook()));

        mockMvc.perform(get("/books/search/survey").param("title", "java"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title", is("Title")));
    }
}