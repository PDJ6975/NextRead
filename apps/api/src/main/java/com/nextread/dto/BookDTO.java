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
public class BookDTO {

    private String title;

    private String isbn10;
    private String isbn13;

    private String publisher;

    private String coverUrl;

    private String synopsis;

    private int pages;

    private int publishedYear;

    private List<String> authors;
}
