package com.nextread.entities;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "recommendation_requests", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "request_date"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "request_date", nullable = false)
    private LocalDate requestDate;

    @Column(name = "request_count", nullable = false)
    @Builder.Default
    private Integer requestCount = 0;

    @Column(name = "max_requests_per_day", nullable = false)
    @Builder.Default
    private Integer maxRequestsPerDay = 3;
}