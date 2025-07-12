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

    @BeforeEach
    void setup() {
        UserBookController ctrl = new UserBookController(userBookService);
        mockMvc = MockMvcBuilders.standaloneSetup(ctrl).build();
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
    @DisplayName("POST /userbooks/add")
    void addBook() throws Exception {
        AddBookRequestDTO req = AddBookRequestDTO.builder()
                .book(Book.builder().title("t").build())
                .userBookDTO(UserBookDTO.builder().rating(3f).build())
                .build();
        when(userBookService.addBookSelected(any(), any(), eq(userPrincipal))).thenReturn(dto());
        mockMvc.perform(post("/userbooks/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)));
    }
}