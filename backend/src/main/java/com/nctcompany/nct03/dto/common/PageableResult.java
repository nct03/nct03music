package com.nctcompany.nct03.dto.common;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Collection;

@Getter
@Setter
@Builder
public class PageableResult<T> {

    private Collection<T> items;
    private Integer pageNum;
    private Integer pageSize;
    private Long totalItems;
    private Integer totalPages;
}
