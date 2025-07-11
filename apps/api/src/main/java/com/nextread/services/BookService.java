package com.nextread.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.nextread.dto.BookDTO;
import com.nextread.entities.Book;
import com.nextread.repositories.BookRepository;

import jakarta.transaction.Transactional;

@Service
public class BookService {

    private final BookRepository bookRepository;

    private final RestTemplate restTemplate;

    @Autowired
    public BookService(BookRepository bookRepository, RestTemplate restTemplate) {
        this.bookRepository = bookRepository;
        this.restTemplate = restTemplate;
    }

    /**
     * Recupera todos los libros almacenados en la base de datos.
     * 
     * @return Lista de todos los libros disponibles
     */
    @Transactional
    public List<Book> findAllBooks() {
        List<Book> books = new ArrayList<>();
        bookRepository.findAll().forEach(books::add);
        return books;
    }

    /**
     * Busca un libro por ISBN en la base de datos local. Si no se encuentra,
     * consulta la API de Google Books para obtener los datos del libro.
     * 
     * @param isbn El ISBN del libro a buscar. Debe ser el ISBN-13
     * @return BookDTO con los datos del libro (desde BD o Google Books)
     * @throws RuntimeException si el libro no se encuentra ni en BD ni en Google
     *                          Books
     */
    public BookDTO findRecommendedBook(String title) throws RuntimeException {

        List<Book> localMatches = bookRepository.findByTitleIgnoreCase(title);

        if (!localMatches.isEmpty()) {
            Book loadedBook = localMatches.get(0);
            BookDTO bookDTO = BookDTO.builder()
                    .title(loadedBook.getTitle())
                    .isbn10(loadedBook.getIsbn10())
                    .isbn13(loadedBook.getIsbn13())
                    .publisher(loadedBook.getPublisher())
                    .coverUrl(loadedBook.getCoverUrl())
                    .synopsis(loadedBook.getSynopsis())
                    .pages(loadedBook.getPages())
                    .publishedYear(loadedBook.getPublishedYear())
                    .authors(loadedBook.getAuthors().stream().map(a -> a.getName()).toList())
                    .build();
            return bookDTO;
        } else {
            BookDTO bookDTO = findGoogleBook(title);
            return bookDTO;
        }
    }

    /**
     * Consulta la API de Google Books para obtener información de un libro por
     * ISBN.
     * Extrae los campos relevantes del JSON de respuesta y los mapea a un BookDTO.
     * 
     * @param isbn El ISBN-13 del libro a buscar en Google Books
     * @return BookDTO con los datos del libro obtenidos de Google Books
     * @throws RuntimeException si el libro no se encuentra en Google Books
     */
    private BookDTO findGoogleBook(String title) {

        String url = "https://www.googleapis.com/books/v1/volumes?q=intitle:" + title.replace(" ", "+");
        JsonNode root = restTemplate.getForObject(url, JsonNode.class);

        if (root == null || root.path("items").isEmpty()) {
            throw new RuntimeException("Libro no encontrado.");
        }

        JsonNode item0 = root.path("items").get(0);
        JsonNode info = item0.path("volumeInfo");
        JsonNode identifiers = info.path("industryIdentifiers");
        JsonNode imageLinks = info.path("imageLinks");

        String isbn10 = null;
        String isbn13 = null;
        for (JsonNode idNode : identifiers) {
            String type = idNode.path("type").asText();
            String idVal = idNode.path("identifier").asText();
            if ("ISBN_10".equals(type))
                isbn10 = idVal;
            if ("ISBN_13".equals(type))
                isbn13 = idVal;
        }
        String cover = imageLinks.path("thumbnail").asText();
        List<String> authors = new ArrayList<>();
        info.path("authors").forEach(a -> authors.add(a.asText()));

        return BookDTO.builder()
                .title(info.path("title").asText())
                .isbn10(isbn10)
                .isbn13(isbn13)
                .coverUrl(cover)
                .synopsis(info.path("description").asText())
                .pages(info.path("pageCount").asInt())
                .publishedYear(info.path("publishedDate").asInt())
                .authors(authors)
                .build();
    }
}
