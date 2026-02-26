package com.wine.job.task;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class OrderTimeoutTask {
    
    @Scheduled(fixedRate = 60000)
    public void checkTimeoutOrders() {
        log.info("检查超时订单...");
    }
}
