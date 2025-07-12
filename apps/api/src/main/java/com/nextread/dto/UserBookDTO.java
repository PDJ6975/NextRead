package com.nextread.dto;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nextread.entities.ReadingStatus;

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
public class UserBookDTO {

    // Datos del UserBook
    @JsonProperty(access = JsonProperty.Access.READ_ONLY) // Solo lectura en respuestas
    private Long id;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY) // Solo lectura en respuestas
    private Long bookId;

    private Float rating;
    private ReadingStatus status;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY) // Solo lectura en respuestas
    private Instant createdAt;

    private Instant startedAt;
    private Instant finishedAt;
}