package com.nextread.dto;

import java.time.Instant;
import java.util.List;

import com.nextread.entities.GenreSelection;
import com.nextread.entities.PaceSelection;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class SurveyResponseDTO {

    private Long id;

    private PaceSelection pace;

    private Instant createdAt;

    private Instant updatedAt;

    private List<GenreSelection> selectedGenres;
}
