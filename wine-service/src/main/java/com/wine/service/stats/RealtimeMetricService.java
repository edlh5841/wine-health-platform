package com.wine.service.stats;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class RealtimeMetricService {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    /**
     * 每秒推送实时数据
     */
    @Scheduled(fixedRate = 5000)
    public void pushRealtimeMetrics() {
        String today = LocalDate.now().format(DateTimeFormatter.ISO_DATE);
        
        // 从Redis获取实时数据
        Map<Object, Object> gmvData = redisTemplate.opsForHash()
                .entries("realtime:gmv:" + today);
        
        BigDecimal todayGmv = new BigDecimal((String) gmvData.getOrDefault("gmv", "0"));
        
        log.info("实时GMV推送: {}元", todayGmv);
    }

    /**
     * 更新GMV
     */
    public void updateGmv(BigDecimal amount) {
        String today = LocalDate.now().format(DateTimeFormatter.ISO_DATE);
        String key = "realtime:gmv:" + today;
        
        redisTemplate.opsForHash().increment(key, "gmv", amount.doubleValue());
        redisTemplate.opsForHash().increment(key, "orders", 1);
        redisTemplate.expire(key, 24, java.util.concurrent.TimeUnit.HOURS);
    }
}
