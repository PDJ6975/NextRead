package com.nextread.services;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.nextread.entities.Author;
import com.nextread.entities.Book;
import com.nextread.entities.Survey;
import com.nextread.entities.User;
import com.nextread.repositories.AuthorRepository;
import com.nextread.repositories.BookRepository;

import org.springframework.transaction.annotation.Transactional;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final RestTemplate restTemplate;
    private final SurveyService surveyService;

    @Autowired
    public BookService(BookRepository bookRepository, AuthorRepository authorRepository, RestTemplate restTemplate,
            SurveyService surveyService) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.restTemplate = restTemplate;
        this.surveyService = surveyService;
    }

    /**
     * Recupera todos los libros almacenados en la base de datos.
     * 
     * @return Lista de todos los libros disponibles
     */
    @Transactional(readOnly = true)
    public List<Book> findAllBooks() {
        List<Book> books = new ArrayList<>();
        bookRepository.findAll().forEach(books::add);
        return books;
    }

    /**
     * Busca un libro por su ID en la base de datos.
     * 
     * @param id El ID del libro a buscar
     * @return El libro encontrado o excepción si no existe
     */
    @Transactional(readOnly = true)
    public Book findBookById(Long id) {
        return bookRepository.findById(id).orElseThrow(() -> new RuntimeException("Libro no encontrado"));
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
    @Transactional(readOnly = true)
    public Book findRecommendedBook(String title) throws RuntimeException {

        List<Book> localMatches = bookRepository.findByTitleIgnoreCase(title);

        if (!localMatches.isEmpty()) {
            Book loadedBook = localMatches.get(0);
            return loadedBook;
        } else {
            Book googleBook = findGoogleBook(title);
            return googleBook;
        }
    }

    /**
     * Busca libros por título usando estrategia híbrida:
     * 1. Busca en BD local (libros ya conocidos/utilizados)
     * 2. Busca en Google Books (nuevas ediciones/libros)
     * 3. Combina y deduplica por ISBN13
     * 4. Prioriza resultados locales al inicio
     */
    @Transactional(readOnly = true)
    public List<Book> findBooks(String title) throws RuntimeException {
        System.out.println("🔍 Búsqueda híbrida para: " + title);

        List<Book> results = new ArrayList<>();

        // 1. Buscar en BD local primero
        List<Book> localMatches = bookRepository.findByTitleIgnoreCase(title);
        System.out.println("📚 Libros locales encontrados: " + localMatches.size());

        // Añadir libros locales (tienen prioridad)
        results.addAll(localMatches);

        // 2. Buscar en Google Books para encontrar más ediciones
        try {
            List<Book> googleBooks = findGoogleBooks(title);
            System.out.println("🌐 Libros de Google Books encontrados: " + googleBooks.size());

            // 3. Añadir libros de Google Books que no estén duplicados
            Set<String> existingISBNs = results.stream()
                    .map(Book::getIsbn13)
                    .filter(isbn -> isbn != null && !isbn.trim().isEmpty())
                    .collect(Collectors.toSet());

            for (Book googleBook : googleBooks) {
                boolean isDuplicate = false;

                // Verificar por ISBN13
                if (googleBook.getIsbn13() != null && !googleBook.getIsbn13().trim().isEmpty()) {
                    if (existingISBNs.contains(googleBook.getIsbn13())) {
                        isDuplicate = true;
                        System.out.println("📖 Libro duplicado por ISBN13: " + googleBook.getIsbn13());
                    }
                }

                // Si no es duplicado, verificar por título+autor (para libros sin ISBN)
                if (!isDuplicate && (googleBook.getIsbn13() == null || googleBook.getIsbn13().trim().isEmpty())) {
                    String googleFirstAuthor = googleBook.getAuthors() != null && !googleBook.getAuthors().isEmpty()
                            ? googleBook.getAuthors().get(0).getName().toLowerCase().trim()
                            : "";

                    for (Book existing : results) {
                        String existingFirstAuthor = existing.getAuthors() != null && !existing.getAuthors().isEmpty()
                                ? existing.getAuthors().get(0).getName().toLowerCase().trim()
                                : "";

                        if (!googleFirstAuthor.isEmpty() &&
                                googleFirstAuthor.equals(existingFirstAuthor) &&
                                googleBook.getTitle().toLowerCase().trim()
                                        .equals(existing.getTitle().toLowerCase().trim())) {
                            isDuplicate = true;
                            System.out.println("📖 Libro duplicado por título+autor: " + googleBook.getTitle());
                            break;
                        }
                    }
                }

                if (!isDuplicate) {
                    results.add(googleBook);
                    if (googleBook.getIsbn13() != null && !googleBook.getIsbn13().trim().isEmpty()) {
                        existingISBNs.add(googleBook.getIsbn13());
                    }
                    System.out.println(
                            "✅ Nuevo libro añadido: " + googleBook.getTitle() + " (" + googleBook.getPublisher() + ")");
                }
            }

        } catch (Exception e) {
            System.out.println("⚠️ Error al buscar en Google Books: " + e.getMessage());
            // Continuar con solo resultados locales si Google Books falla
        }

        System.out.println("🎯 Total de resultados únicos: " + results.size());
        return results;
    }

    /**
     * Consulta la API de Google Books para obtener libros según título al hacer una
     * búsqueda por título
     * 
     * @param title El título del libro
     * @return BookDTO con los datos del libro obtenidos de Google Books
     * @throws RuntimeException si no se encuentran resultados
     */
    private List<Book> findGoogleBooks(String title) {

        String url = "https://www.googleapis.com/books/v1/volumes?q=intitle:" + title.replace(" ", "+");
        JsonNode root = restTemplate.getForObject(url, JsonNode.class);
        if (root == null || root.path("items").isEmpty()) {
            throw new RuntimeException("No se encontraron libros con título: " + title);
        }

        List<Book> results = new ArrayList<>();
        for (JsonNode item : root.path("items")) {
            JsonNode info = item.path("volumeInfo");
            JsonNode identifiers = info.path("industryIdentifiers");
            JsonNode imageLinks = info.path("imageLinks");

            String isbn10 = null, isbn13 = null;
            for (JsonNode idNode : identifiers) {
                switch (idNode.path("type").asText()) {
                    case "ISBN_10" -> isbn10 = idNode.path("identifier").asText();
                    case "ISBN_13" -> isbn13 = idNode.path("identifier").asText();
                }
            }

            List<String> authorNames = new ArrayList<>();
            info.path("authors").forEach(a -> authorNames.add(a.asText()));

            List<Author> authors = authorNames.stream()
                    .map(name -> Author.builder().name(name).build())
                    .collect(Collectors.toList());

            results.add(Book.builder()
                    .title(info.path("title").asText())
                    .isbn10(isbn10)
                    .isbn13(isbn13)
                    .publisher(info.path("publisher").asText("Editorial desconocida"))
                    .coverUrl(imageLinks.path("thumbnail").asText(null))
                    .synopsis(info.path("description").asText(null))
                    .pages(info.path("pageCount").asInt(0))
                    .publishedYear(info.path("publishedDate").asText(null))
                    .authors(authors)
                    .build());
        }
        return results;
    }

    /**
     * Consulta la API de Google Books para obtener información de un libro por
     * título
     * Extrae los campos relevantes del JSON de respuesta y los mapea a un BookDTO.
     * 
     * @param title El título del libro
     * @return BookDTO con los datos del libro obtenidos de Google Books
     * @throws RuntimeException si el libro no se encuentra en Google Books
     */
    private Book findGoogleBook(String title) {

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
        List<String> authorNames = new ArrayList<>();
        info.path("authors").forEach(a -> authorNames.add(a.asText()));

        List<Author> authors = authorNames.stream()
                .map(name -> Author.builder().name(name).build())
                .collect(Collectors.toList());

        return Book.builder()
                .title(info.path("title").asText())
                .isbn10(isbn10)
                .isbn13(isbn13)
                .publisher(info.path("publisher").asText("Editorial desconocida")) // Añadir publisher
                .coverUrl(cover)
                .synopsis(info.path("description").asText())
                .pages(info.path("pageCount").asInt())
                .publishedYear(info.path("publishedDate").asText())
                .authors(authors)
                .build();
    }

    @Transactional
    public List<Book> findBookCauseSurvey(String title, User user) {

        Survey survey = surveyService.findSurveyByUser(user);

        if (survey.getFirstTime().equals(true)) {
            return findBooks(title);
        } else {
            throw new RuntimeException("No es la primera vez que realizas la encuesta.");
        }
    }

    @Transactional
    public Book saveBook(Book book) {
        System.out.println("📖 BookService.saveBook - Iniciando guardado de libro: " + book.getTitle());
        System.out.println("📖 Datos del libro:");
        System.out.println("   - Title: " + book.getTitle());
        System.out.println("   - ISBN10: " + book.getIsbn10());
        System.out.println("   - ISBN13: " + book.getIsbn13());
        System.out.println("   - Publisher: " + book.getPublisher());
        System.out.println("   - CoverUrl: " + book.getCoverUrl());
        System.out.println(
                "   - Synopsis length: " + (book.getSynopsis() != null ? book.getSynopsis().length() : "null"));
        System.out.println("   - Synopsis: " + (book.getSynopsis() != null
                ? book.getSynopsis().substring(0, Math.min(100, book.getSynopsis().length())) + "..."
                : "null"));
        System.out.println("   - Pages: " + book.getPages());
        System.out.println("   - PublishedYear: " + book.getPublishedYear());
        System.out.println("   - Authors count: " + (book.getAuthors() != null ? book.getAuthors().size() : 0));

        // Sanitizar datos antes de guardar
        sanitizeBookData(book);

        // Primero, manejar los autores
        if (book.getAuthors() != null && !book.getAuthors().isEmpty()) {
            List<Author> persistedAuthors = new ArrayList<>();

            for (Author author : book.getAuthors()) {
                Author persistedAuthor;

                // Buscar si el autor ya existe por nombre
                var existingAuthor = authorRepository.findByName(author.getName());
                if (existingAuthor.isPresent()) {
                    persistedAuthor = existingAuthor.get();
                    System.out.println("📖 Autor existente encontrado: " + persistedAuthor.getName());
                } else {
                    // Crear nuevo autor
                    persistedAuthor = authorRepository.save(Author.builder().name(author.getName()).build());
                    System.out.println("📖 Nuevo autor creado: " + persistedAuthor.getName());
                }

                persistedAuthors.add(persistedAuthor);
            }

            book.setAuthors(persistedAuthors);
        }

        // Verificar si el libro ya existe - Estrategia mejorada
        System.out.println("🔍 Verificando si el libro ya existe...");

        // Prioridad 1: Buscar por ISBN13 (más confiable)
        if (book.getIsbn13() != null && !book.getIsbn13().trim().isEmpty()) {
            var existingByIsbn13 = bookRepository.findByIsbn13(book.getIsbn13());
            if (existingByIsbn13.isPresent()) {
                System.out.println("📖 Libro existente encontrado por ISBN13: " + book.getIsbn13());
                System.out.println("📖 Reutilizando libro existente: " + existingByIsbn13.get().getTitle() + " (ID: "
                        + existingByIsbn13.get().getId() + ")");
                return existingByIsbn13.get();
            }
        }

        // Prioridad 2: Si no hay ISBN13, buscar por título exacto + primer autor
        // SOLO si el libro no tiene ISBN13, consideramos el título+autor como posible
        // duplicado
        if (book.getIsbn13() == null || book.getIsbn13().trim().isEmpty()) {
            System.out.println("⚠️ Libro sin ISBN13, verificando por título+autor...");
            var existingByTitle = bookRepository.findByTitleIgnoreCase(book.getTitle());

            if (!existingByTitle.isEmpty()) {
                // Si hay libros con el mismo título, verificar si alguno tiene el mismo primer
                // autor
                String newBookFirstAuthor = book.getAuthors() != null && !book.getAuthors().isEmpty()
                        ? book.getAuthors().get(0).getName().toLowerCase().trim()
                        : "";

                for (Book existing : existingByTitle) {
                    String existingFirstAuthor = existing.getAuthors() != null && !existing.getAuthors().isEmpty()
                            ? existing.getAuthors().get(0).getName().toLowerCase().trim()
                            : "";

                    if (!newBookFirstAuthor.isEmpty() && newBookFirstAuthor.equals(existingFirstAuthor)) {
                        System.out.println("📖 Libro existente encontrado por título+autor: " + existing.getTitle()
                                + " - " + existingFirstAuthor);
                        System.out.println("📖 Reutilizando libro existente: (ID: " + existing.getId() + ")");
                        return existing;
                    }
                }
                System.out
                        .println("📖 Títulos similares encontrados pero con autores diferentes - creando nuevo libro");
            }
        }

        System.out.println("📖 Es un libro nuevo, procediendo a guardar...");

        // Guardar el libro con autores persistidos
        Book savedBook = bookRepository.save(book);
        System.out.println(
                "📖 Libro guardado exitosamente: " + savedBook.getTitle() + " (ID: " + savedBook.getId() + ")");

        return savedBook;
    }

    private void sanitizeBookData(Book book) {
        System.out.println("🧹 Sanitizando datos del libro...");

        // Sanitizar coverUrl
        if (book.getCoverUrl() != null && (book.getCoverUrl().trim().isEmpty() || book.getCoverUrl().equals("null"))) {
            book.setCoverUrl(null);
            System.out.println("🧹 CoverUrl limpiado (estaba vacío o 'null')");
        }

        // Sanitizar synopsis
        if (book.getSynopsis() != null) {
            String synopsis = book.getSynopsis().trim();
            if (synopsis.isEmpty() || synopsis.equals("null")) {
                book.setSynopsis(null);
                System.out.println("🧹 Synopsis limpiado (estaba vacío o 'null')");
            } else if (synopsis.length() > 5000) {
                book.setSynopsis(synopsis.substring(0, 4997) + "...");
                System.out.println("🧹 Synopsis truncado de " + synopsis.length() + " a 5000 caracteres");
            }
        }

        // Sanitizar publisher si está vacío
        if (book.getPublisher() != null
                && (book.getPublisher().trim().isEmpty() || book.getPublisher().equals("null"))) {
            book.setPublisher("Editorial desconocida");
            System.out.println("🧹 Publisher establecido a 'Editorial desconocida'");
        }

        // Validar pages
        if (book.getPages() <= 0) {
            book.setPages(1);
            System.out.println("🧹 Pages establecido a 1 (era " + book.getPages() + ")");
        }

        System.out.println("🧹 Sanitización completada");
    }
}
