package com.wine.service.order;

import com.wine.domain.entity.OrderMaster;
import com.wine.domain.mapper.OrderMasterMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@Slf4j
public class OrderService {
    
    @Autowired
    private OrderMasterMapper orderMapper;
    
    @Transactional
    public OrderMaster createOrder(Long userId, Long technicianId, Long batchId, 
                                   Integer quantity, BigDecimal amount) {
        OrderMaster order = new OrderMaster();
        order.setUserId(userId);
        order.setTechnicianId(technicianId);
        order.setDepositBatchId(batchId);
        order.setPredictQuantity(quantity);
        order.setOrderAmount(amount);
        order.setStatus(0);
        order.setVersion(0);
        
        orderMapper.insert(order);
        return order;
    }
    
    @Transactional
    public void paySuccess(Long orderId, String transactionId) {
        OrderMaster order = orderMapper.selectById(orderId);
        if (order == null) return;
        
        order.setPayAmount(order.getOrderAmount());
        order.setPayTime(LocalDateTime.now());
        order.setTransactionId(transactionId);
        order.setStatus(1);
        
        orderMapper.updateById(order);
        log.info("订单支付成功: orderId={}", orderId);
    }
}
