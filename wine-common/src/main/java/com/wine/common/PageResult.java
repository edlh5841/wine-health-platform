package com.wine.common;

import lombok.Data;
import java.io.Serializable;

@Data
public class PageResult<T> implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private Long total;
    private Long pages;
    private Long current;
    private Long size;
    private T records;
    
    public static <T> PageResult<T> of(Long total, Long current, Long size, T records) {
        PageResult<T> result = new PageResult<>();
        result.setTotal(total);
        result.setCurrent(current);
        result.setSize(size);
        result.setRecords(records);
        result.setPages((total + size - 1) / size);
        return result;
    }
}
