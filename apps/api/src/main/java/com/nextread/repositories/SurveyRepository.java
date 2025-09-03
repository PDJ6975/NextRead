package com.nextread.repositories;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.nextread.entities.Survey;
import com.nextread.entities.User;

@Repository
public interface SurveyRepository extends CrudRepository<Survey, Long> {

    Optional<Survey> findByUser(User user);
}
