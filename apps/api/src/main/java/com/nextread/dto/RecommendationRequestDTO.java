package com.nextread.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class RecommendationRequestDTO {

    @NotNull(message = "El ID del libro es obligatorio")
    private Long bookId;

    @NotBlank(message = "La razón de la recomendación es obligatoria")
    private String reason;
}