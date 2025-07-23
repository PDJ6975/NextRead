package com.nextread.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.nextread.entities.Book;
import com.nextread.entities.Recommendation;
import com.nextread.entities.RecommendationStatus;
import com.nextread.entities.User;

@Repository
public interface RecommendationRepository extends CrudRepository<Recommendation, Long> {

    List<Recommendation> findByRecommendedUser(User user);

    List<Recommendation> findByRecommendedUserAndStatus(User user, RecommendationStatus status);

    void deleteByRecommendedUserAndRecommendedBook(User user, Book book);
}