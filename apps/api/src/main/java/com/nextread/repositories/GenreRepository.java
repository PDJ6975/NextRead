package com.nextread.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.nextread.entities.Genre;

@Repository
public interface GenreRepository extends CrudRepository<Genre, Long> {

}