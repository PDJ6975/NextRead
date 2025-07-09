package com.nextread.entities;

import java.time.Instant;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import com.nextread.utils.anotations.HalfStarIncrement;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.FetchType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.EqualsAndHashCode;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_book")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class UserBook {

    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @HalfStarIncrement
    @Min(0) @Max(5)
    private Float rating;

    @Enumerated(EnumType.STRING)
    private ReadingStatus status;

    @CreationTimestamp
    private Instant createdAt;

    @Column(nullable = true)
    private Instant startedAt;

    @Column(nullable = true)
    private Instant finishedAt;
    
    @Version
    private Long version;

    // Relationships

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    private Book book;

    // Relación ManyToMany con Survey, con UserBook como dueña

    @JsonManagedReference
    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
        name = "user_book_survey",
        joinColumns = @JoinColumn(name = "user_book_id"),
        inverseJoinColumns = @JoinColumn(name = "survey_id")
    )
    private List<Survey> surveys;
}
