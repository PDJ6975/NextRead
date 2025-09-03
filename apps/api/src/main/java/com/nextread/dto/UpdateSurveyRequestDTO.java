package com.nextread.dto;

import java.util.List;
import com.nextread.entities.PaceSelection;
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
public class UpdateSurveyRequestDTO {
    private PaceSelection pace;
    private List<Long> genresIds;
}