package com.nextread.controller;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.*;
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
import org.springframework.http.MediaType;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nextread.dto.AddBookRequestDTO;
import com.nextread.dto.UserBookDTO;
import com.nextread.entities.Book;
import com.nextread.entities.User;
import com.nextread.services.UserBookService;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;

@ExtendWith(MockitoExtension.class)
class UserBookControllerTest {

    @Mock
    private UserBookService userBookService;

    private MockMvc mockMvc;
    private final ObjectMapper mapper = new ObjectMapper();

    private User userPrincipal;

    private UserBookDTO dto() {
        return UserBookDTO.builder().id(1L).rating(4f).build();
    }

    private Book createValidBook(String title) {
        return Book.builder()
                .title(title)
                .isbn10("1234567890")
                .isbn13("1234567890123")
                .publisher("Test Publisher")
                .coverUrl("https://example.com/cover.jpg")
                .synopsis("Test synopsis")
                .pages(100)
                .publishedYear("2024")
                .build();
    }

    @BeforeEach
    void setup() {
        UserBookController ctrl = new UserBookController(userBookService);
        mockMvc = MockMvcBuilders.standaloneSetup(ctrl)
                .setMessageConverters(new MappingJackson2HttpMessageConverter(new ObjectMapper()))
                .build();
        userPrincipal = new User();
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(userPrincipal, null, List.of()));
    }

    @Test
    @DisplayName("GET /userbooks")
    void listUserBooks() throws Exception {
        when(userBookService.findUserBooksAsDTO(userPrincipal)).thenReturn(List.of(dto()));
        mockMvc.perform(get("/userbooks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id", is(1)));
    }

    @Test
    @DisplayName("GET /userbooks/{id}")
    void getUserBookById() throws Exception {
        when(userBookService.findUserBookByIdAsDTO(5L, userPrincipal)).thenReturn(dto());
        mockMvc.perform(get("/userbooks/5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)));
    }

    @Test
    @DisplayName("PUT /userbooks/{id}")
    void updateUserBook() throws Exception {
        UserBookDTO input = UserBookDTO.builder().rating(5f).build();
        when(userBookService.updateUserBook(eq(5L), eq(userPrincipal), any())).thenReturn(dto());
        mockMvc.perform(put("/userbooks/5")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)));
    }

    @Test
    @DisplayName("DELETE /userbooks/{id}")
    void deleteUserBook() throws Exception {
        mockMvc.perform(delete("/userbooks/9"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Libro eliminado")));
        verify(userBookService).deleteUserBook(9L, userPrincipal);
    }

    @Test
    @DisplayName("POST /userbooks")
    void addBookToUserList() throws Exception {
        AddBookRequestDTO req = AddBookRequestDTO.builder()
                .book(createValidBook("Test Book"))
                .userBookDTO(UserBookDTO.builder().rating(3f).build())
                .build();

        when(userBookService.addBookSelected(any(), any(), eq(userPrincipal))).thenReturn(dto());

        mockMvc.perform(post("/userbooks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)));

        verify(userBookService).addBookSelected(any(), any(), eq(userPrincipal));
    }

    @Test
    @DisplayName("POST /userbooks - should call service with data")
    void addBookToUserListCallsService() throws Exception {
        AddBookRequestDTO req = AddBookRequestDTO.builder()
                .book(createValidBook("Another Book"))
                .userBookDTO(UserBookDTO.builder().rating(4.5f).build())
                .build();

        when(userBookService.addBookSelected(any(), any(), eq(userPrincipal))).thenReturn(dto());

        mockMvc.perform(post("/userbooks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)));

        verify(userBookService).addBookSelected(any(), any(), eq(userPrincipal));
    }

    @Test
    @DisplayName("POST /userbooks - should call service correctly")
    void addBookToUserListCallsServiceCorrectly() throws Exception {
        AddBookRequestDTO req = AddBookRequestDTO.builder()
                .book(createValidBook("Different Book"))
                .userBookDTO(UserBookDTO.builder().rating(2.5f).build())
                .build();

        when(userBookService.addBookSelected(any(), any(), eq(userPrincipal))).thenReturn(dto());

        mockMvc.perform(post("/userbooks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)));

        verify(userBookService).addBookSelected(any(), any(), eq(userPrincipal));
    }
}