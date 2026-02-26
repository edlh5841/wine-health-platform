package com.wine.infra.id;

import cn.hutool.core.lang.Snowflake;
import cn.hutool.core.util.IdUtil;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Component
public class IdGenerator {
    private final Snowflake snowflake = IdUtil.getSnowflake(1, 1);

    public String generateOrderNo() {
        long id = snowflake.nextId();
        String date = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        return String.format("W%s%08d", date, id % 100000000);
    }

    public String generateWriteOffNo() {
        long id = snowflake.nextId();
        String date = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        return String.format("WO%s%08d", date, id % 100000000);
    }

    public String generateSplitNo() {
        long id = snowflake.nextId();
        String date = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        return String.format("SP%s%08d", date, id % 100000000);
    }
}
