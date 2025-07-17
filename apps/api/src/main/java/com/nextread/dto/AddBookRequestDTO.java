package com.nextread.dto;

import com.nextread.entities.Book;
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
public class AddBookRequestDTO {
    private Book book;
    private UserBookDTO userBookDTO;
}