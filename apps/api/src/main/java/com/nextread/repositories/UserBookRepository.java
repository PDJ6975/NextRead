package com.nextread.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.nextread.entities.User;
import com.nextread.entities.UserBook;

@Repository
public interface UserBookRepository extends CrudRepository<UserBook, Long> {

    List<UserBook> findByUser(User user);

    Optional<UserBook> findByIdAndUser(Long id, User user);
}