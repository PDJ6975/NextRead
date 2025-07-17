package com.nextread.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.Instant;
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

import com.nextread.dto.UserBookDTO;
import com.nextread.entities.Book;
import com.nextread.entities.ReadingStatus;
import com.nextread.entities.Survey;
import com.nextread.entities.User;
import com.nextread.entities.UserBook;
import com.nextread.repositories.UserBookRepository;

@ExtendWith(MockitoExtension.class)
class UserBookServiceTest {

    @Mock
    private UserBookRepository userBookRepository;
    @Mock
    private BookService bookService;
    @Mock
    private SurveyService surveyService;

    @InjectMocks
    private UserBookService service;

    private User user;
    private Book bookWithId;
    private Book bookNoId;

    @BeforeEach
    void setup() {
        user = new User();
        bookWithId = Book.builder().id(10L).title("t").build();
        bookNoId = Book.builder().title("t").build();
    }

    private UserBook entity(Long id) {
        return UserBook.builder()
                .id(id)
                .user(user)
                .book(bookWithId)
                .rating(3f)
                .status(ReadingStatus.READ)
                .createdAt(Instant.now())
                .build();
    }

    @Test
    @DisplayName("findUserBooks / findUserBooksAsDTO")
    void listBooks() {
        when(userBookRepository.findByUser(user)).thenReturn(List.of(entity(1L)));
        assertEquals(1, service.findUserBooks(user).size());
        assertEquals(1, service.findUserBooksAsDTO(user).size());
    }

    @Nested
    @DisplayName("findUserBookById")
    class FindById {
        @Test
        void found() {
            UserBook ub = entity(1L);
            when(userBookRepository.findByIdAndUser(1L, user)).thenReturn(Optional.of(ub));
            assertEquals(ub, service.findUserBookById(1L, user));
        }

        @Test
        void notFoundThrows() {
            when(userBookRepository.findByIdAndUser(1L, user)).thenReturn(Optional.empty());
            assertThrows(RuntimeException.class, () -> service.findUserBookById(1L, user));
        }
    }

    @Test
    @DisplayName("updateUserBook updates only provided fields")
    void updateBook() {
        UserBook ub = entity(1L);
        when(userBookRepository.findByIdAndUser(1L, user)).thenReturn(Optional.of(ub));
        when(userBookRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        UserBookDTO dto = UserBookDTO.builder().rating(4.5f).build();
        UserBookDTO res = service.updateUserBook(1L, user, dto);
        assertEquals(4.5f, res.getRating());
    }

    @Nested
    @DisplayName("addBookSelected")
    class AddBook {
        @Test
        void addsNewGoogleBook_firstTime() {
            // book sin id
            when(bookService.saveBook(bookNoId)).thenReturn(bookWithId);
            when(userBookRepository.findByUser(user)).thenReturn(new ArrayList<>()); // no dup
            when(userBookRepository.save(any())).thenAnswer(inv -> {
                UserBook saved = (UserBook) inv.getArgument(0);
                saved.setId(50L);
                return saved;
            });
            Survey survey = Survey.builder().firstTime(true).build();
            when(surveyService.findSurveyByUser(user)).thenReturn(survey);
            when(surveyService.saveSurvey(survey)).thenReturn(survey);

            // Mock para la llamada interna a updateUserBook
            UserBook savedUserBook = entity(50L);
            when(userBookRepository.findByIdAndUser(50L, user)).thenReturn(Optional.of(savedUserBook));

            UserBookDTO dto = UserBookDTO.builder().status(ReadingStatus.TO_READ).build();

            UserBookDTO res = service.addBookSelected(bookNoId, dto, user);
            assertEquals(ReadingStatus.TO_READ, res.getStatus());
            assertFalse(survey.getFirstTime()); // should have sido marcado a false
        }

        @Test
        void duplicateBookThrows() {
            when(userBookRepository.findByUser(user)).thenReturn(List.of(entity(1L)));
            RuntimeException ex = assertThrows(RuntimeException.class,
                    () -> service.addBookSelected(bookWithId, new UserBookDTO(), user));
            assertTrue(ex.getMessage().contains("ya tiene"));
        }

        @Test
        void addsExistingBook_notFirstTime() {
            when(userBookRepository.findByUser(user)).thenReturn(new ArrayList<>());
            when(userBookRepository.save(any())).thenAnswer(inv -> {
                UserBook saved = (UserBook) inv.getArgument(0);
                saved.setId(60L);
                return saved;
            });
            Survey s = Survey.builder().firstTime(false).build();
            when(surveyService.findSurveyByUser(user)).thenReturn(s);

            // Mock para la llamada interna a updateUserBook
            UserBook savedUserBook = entity(60L);
            when(userBookRepository.findByIdAndUser(60L, user)).thenReturn(Optional.of(savedUserBook));

            UserBookDTO result = service.addBookSelected(bookWithId, new UserBookDTO(), user);
            assertNotNull(result.getId());
        }
    }

    @Test
    void deleteUserBook_callsRepo() {
        UserBook ub = entity(2L);
        when(userBookRepository.findByIdAndUser(2L, user)).thenReturn(Optional.of(ub));
        service.deleteUserBook(2L, user);
        verify(userBookRepository).delete(ub);
    }
}