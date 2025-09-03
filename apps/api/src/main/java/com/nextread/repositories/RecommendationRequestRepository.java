package com.nextread.repositories;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nextread.entities.RecommendationRequest;
import com.nextread.entities.User;

@Repository
public interface RecommendationRequestRepository extends JpaRepository<RecommendationRequest, Long> {

    Optional<RecommendationRequest> findByUserAndRequestDate(User user, LocalDate requestDate);
    
    void deleteByRequestDateBefore(LocalDate date);
}