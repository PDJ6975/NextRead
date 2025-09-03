package com.nextread.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeneratedRecommendationDTO {

    private String title;
    private String reason;

    // Información adicional del libro (enriquecida desde BD o Google Books)
    private String coverUrl;
    private String isbn13;
    private String isbn10;
    private String publisher;
    private String publishedYear;
    private Integer pages;
    private String synopsis;
    private List<String> authors;

    // Flag para indicar si se encontró información adicional
    private boolean enriched;

    // ID del libro si existe en la BD
    private Long bookId;
}