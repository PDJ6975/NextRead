package com.nextread.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.nextread.entities.Book;

@Repository
public interface BookRepository extends CrudRepository<Book, Long> {

    Optional<Book> findByIsbn13(String isbn13);

    List<Book> findByTitleIgnoreCase(String title);
}
