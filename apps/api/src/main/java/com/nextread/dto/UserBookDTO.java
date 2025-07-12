package com.nextread.dto;

import java.time.Instant;

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
    private Long id;
    private Long bookId;
    private Float rating;
    private ReadingStatus status;
    private Instant createdAt;
    private Instant startedAt;
    private Instant finishedAt;
}