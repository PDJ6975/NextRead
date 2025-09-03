package com.nextread.services;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nextread.entities.RecommendationRequest;
import com.nextread.entities.User;
import com.nextread.repositories.RecommendationRequestRepository;

@Service
public class RateLimitService {

    private final RecommendationRequestRepository recommendationRequestRepository;

    @Value("${app.rate-limit.recommendations-per-day:999}")
    private int maxRecommendationsPerDay;

    @Value("${app.rate-limit.enabled:false}")
    private boolean rateLimitEnabled;

    @Autowired
    public RateLimitService(RecommendationRequestRepository recommendationRequestRepository) {
        this.recommendationRequestRepository = recommendationRequestRepository;
    }

    @Transactional
    public boolean canMakeRequest(User user) {
        if (!rateLimitEnabled) {
            return true;
        }

        LocalDate today = LocalDate.now();
        Optional<RecommendationRequest> existingRequest = recommendationRequestRepository
                .findByUserAndRequestDate(user, today);

        if (existingRequest.isPresent()) {
            RecommendationRequest request = existingRequest.get();
            return request.getRequestCount() < maxRecommendationsPerDay;
        }

        return true;
    }

    @Transactional
    public void recordRequest(User user) {
        if (!rateLimitEnabled) {
            return;
        }

        LocalDate today = LocalDate.now();
        Optional<RecommendationRequest> existingRequest = recommendationRequestRepository
                .findByUserAndRequestDate(user, today);

        if (existingRequest.isPresent()) {
            RecommendationRequest request = existingRequest.get();
            request.setRequestCount(request.getRequestCount() + 1);
            recommendationRequestRepository.save(request);
        } else {
            RecommendationRequest newRequest = RecommendationRequest.builder()
                    .user(user)
                    .requestDate(today)
                    .requestCount(1)
                    .maxRequestsPerDay(maxRecommendationsPerDay)
                    .build();
            recommendationRequestRepository.save(newRequest);
        }
    }

    @Transactional(readOnly = true)
    public int getRemainingRequests(User user) {
        if (!rateLimitEnabled) {
            return Integer.MAX_VALUE;
        }

        LocalDate today = LocalDate.now();
        Optional<RecommendationRequest> existingRequest = recommendationRequestRepository
                .findByUserAndRequestDate(user, today);

        if (existingRequest.isPresent()) {
            RecommendationRequest request = existingRequest.get();
            return Math.max(0, maxRecommendationsPerDay - request.getRequestCount());
        }

        return maxRecommendationsPerDay;
    }

    @Transactional
    public void cleanOldRequests() {
        LocalDate cutoffDate = LocalDate.now().minusDays(30);
        recommendationRequestRepository.deleteByRequestDateBefore(cutoffDate);
    }
}