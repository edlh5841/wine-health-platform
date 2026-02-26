package com.wine.web;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.wine")
@MapperScan("com.wine.domain.mapper")
public class WineWebApplication {
    public static void main(String[] args) {
        SpringApplication.run(WineWebApplication.class, args);
    }
}
