package com.nextread.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nextread.entities.Author;
import com.nextread.entities.Book;
import com.nextread.entities.Survey;
import com.nextread.entities.User;
import com.nextread.repositories.AuthorRepository;
import com.nextread.repositories.BookRepository;

@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    @Mock
    private BookRepository bookRepository;
    @Mock
    private RestTemplate restTemplate;
    @Mock
    private SurveyService surveyService;

    @Mock
    private AuthorRepository authorRepository;

    @InjectMocks
    private BookService bookService;

    private final ObjectMapper mapper = new ObjectMapper();

    private Book sampleBook() {
        return Book.builder()
                .id(1L)
                .title("Sample")
                .isbn10("1234567890")
                .isbn13("1234567890123")
                .publisher("Pub")
                .coverUrl("https://img")
                .synopsis("syn")
                .pages(100)
                .publishedYear("2024")
                .authors(List.of(Author.builder().name("John").build()))
                .build();
    }

    private JsonNode googleResponseJson() throws Exception {
        String json = "{" +
                "\"items\":[{" +
                "\"volumeInfo\":{" +
                "\"title\":\"GoogleBook\"," +
                "\"industryIdentifiers\":[{" +
                "\"type\":\"ISBN_10\",\"identifier\":\"0987654321\"},{" +
                "\"type\":\"ISBN_13\",\"identifier\":\"0987654321098\"}]," +
                "\"imageLinks\":{\"thumbnail\":\"https://img.com/gb.jpg\"}," +
                "\"description\":\"desc\",\"pageCount\":200,\"publishedDate\":\"2023\"," +
                "\"authors\":[\"Jane Doe\"]}}]}";
        return mapper.readTree(json);
    }

    @Nested
    @DisplayName("findAllBooks & findBookById")
    class SimpleQueries {
        @Test
        void findAllBooks_returnsList() {
            Book b = sampleBook();
            when(bookRepository.findAll()).thenReturn(List.of(b));
            List<Book> result = bookService.findAllBooks();
            assertEquals(1, result.size());
            assertEquals("Sample", result.get(0).getTitle());
        }

        @Test
        void findBookById_found() {
            Book b = sampleBook();
            when(bookRepository.findById(1L)).thenReturn(Optional.of(b));
            Book result = bookService.findBookById(1L);
            assertEquals(1L, result.getId());
        }

        @Test
        void findBookById_notFound_throws() {
            when(bookRepository.findById(1L)).thenReturn(Optional.empty());
            assertThrows(RuntimeException.class, () -> bookService.findBookById(1L));
        }
    }

    @Nested
    @DisplayName("findRecommendedBook")
    class Recommended {
        @Test
        void localMatchReturned() {
            Book local = sampleBook();
            when(bookRepository.findByTitleIgnoreCase("Foo"))
                    .thenReturn(List.of(local));
            Book result = bookService.findRecommendedBook("Foo");
            assertEquals(local, result);
            verify(restTemplate, never()).getForObject(anyString(), eq(JsonNode.class));
        }

        @Test
        void noLocalMatch_fetchesFromGoogle() throws Exception {
            when(bookRepository.findByTitleIgnoreCase("Foo"))
                    .thenReturn(new ArrayList<>());
            when(restTemplate.getForObject(anyString(), eq(JsonNode.class)))
                    .thenReturn(googleResponseJson());
            Book result = bookService.findRecommendedBook("Foo");
            assertEquals("GoogleBook", result.getTitle());
        }
    }

    @Nested
    @DisplayName("findBooks")
    class FindBooks {
        @Test
        void localMatchesReturned() {
            when(bookRepository.findByTitleIgnoreCase("A"))
                    .thenReturn(List.of(sampleBook()));
            List<Book> result = bookService.findBooks("A");
            assertEquals(1, result.size());
        }

        @Test
        void googleMatchesReturned() throws Exception {
            when(bookRepository.findByTitleIgnoreCase("A"))
                    .thenReturn(new ArrayList<>());
            when(restTemplate.getForObject(anyString(), eq(JsonNode.class)))
                    .thenReturn(googleResponseJson());
            List<Book> result = bookService.findBooks("A");
            assertEquals(1, result.size());
            assertEquals("GoogleBook", result.get(0).getTitle());
        }
    }

    @Nested
    @DisplayName("findBookCauseSurvey")
    class CauseSurvey {
        private User user;

        @BeforeEach
        void setupUser() {
            user = new User();
        }

        @Test
        void firstTime_allowsSearch() {
            Survey s = Survey.builder().firstTime(true).build();
            when(surveyService.findSurveyByUser(user)).thenReturn(s);
            when(bookRepository.findByTitleIgnoreCase("run"))
                    .thenReturn(List.of(sampleBook()));
            List<Book> result = bookService.findBookCauseSurvey("run", user);
            assertFalse(result.isEmpty());
        }

        @Test
        void notFirstTime_throws() {
            Survey s = Survey.builder().firstTime(false).build();
            when(surveyService.findSurveyByUser(user)).thenReturn(s);
            assertThrows(RuntimeException.class, () -> bookService.findBookCauseSurvey("run", user));
        }
    }

    @Test
    void saveBook_callsRepository() {
        Book b = sampleBook();
        when(bookRepository.save(b)).thenReturn(b);
        Book saved = bookService.saveBook(b);
        assertEquals(b, saved);
        verify(bookRepository).save(b);
    }
}