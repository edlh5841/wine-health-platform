package com.wine.service.push;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class OrderPushService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    /**
     * 推送新订单给技师
     */
    public void pushNewOrder(Long orderId, Long technicianId) {
        String key = "ws:offline:technician:" + technicianId;
        redisTemplate.opsForList().leftPush(key, orderId);
        redisTemplate.expire(key, 24, TimeUnit.HOURS);
        log.info("推送订单给技师: technicianId={}, orderId={}", technicianId, orderId);
    }

    /**
     * 获取技师离线订单
     */
    public Object getOfflineOrders(Long technicianId) {
        String key = "ws:offline:technician:" + technicianId;
        return redisTemplate.opsForList().range(key, 0, -1);
    }
}
