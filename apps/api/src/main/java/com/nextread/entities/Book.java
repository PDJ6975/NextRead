package com.nextread.entities;

import java.time.Instant;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.validator.constraints.URL;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.FetchType;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "books")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String title;

    @NotBlank
    @Column(name = "isbn_10", nullable = false, length = 10, unique = true)
    private String isbn10;

    @NotBlank
    @Column(name = "isbn_13", nullable = false, length = 13, unique = true)
    private String isbn13;

    @NotBlank
    @Column(nullable = false)
    private String publisher;

    @URL // Removido protocol = "https" para permitir HTTP también
    @Column(nullable = true) // Permitir null temporalmente
    private String coverUrl;

    @Size(max = 5000) // Aumentado de 2000 a 5000 caracteres
    @Column(nullable = true, length = 5000) // Permitir null y aumentar longitud
    private String synopsis;

    @Min(1)
    @Column(nullable = false)
    private int pages;

    @Column(nullable = false, length = 10)
    private String publishedYear;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    // Relationships

    // Relación Autor-Libro. Libro es en este caso la dueña de la relación
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "book_author", joinColumns = @JoinColumn(name = "book_id"), inverseJoinColumns = @JoinColumn(name = "author_id"))
    private List<Author> authors;
}
