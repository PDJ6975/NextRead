package com.nextread.repositories;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.nextread.entities.Author;

@Repository
public interface AuthorRepository extends CrudRepository<Author, Long> {

    Optional<Author> findByName(String name);
}