package com.wine.web.controller;

import com.wine.common.Result;
import com.wine.domain.entity.OrderMaster;
import com.wine.domain.entity.Technician;
import com.wine.domain.entity.WineDepositBatch;
import com.wine.domain.mapper.TechnicianMapper;
import com.wine.domain.mapper.WineDepositBatchMapper;
import com.wine.service.order.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class PlatformController {
    
    @Autowired
    private TechnicianMapper technicianMapper;
    
    @Autowired
    private WineDepositBatchMapper depositBatchMapper;
    
    @Autowired
    private OrderService orderService;
    
    @GetMapping("/technicians")
    public Result<List<Technician>> getTechnicians() {
        return Result.success(technicianMapper.selectList(null));
    }
    
    @GetMapping("/deposits")
    public Result<List<WineDepositBatch>> getDeposits(@RequestParam Long userId) {
        return Result.success(depositBatchMapper.selectList(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<>()
                .eq(WineDepositBatch::getUserId, userId)
        ));
    }
    
    @PostMapping("/order/create")
    public Result<Map<String, Object>> createOrder(@RequestBody Map<String, Object> params) {
        Long userId = Long.valueOf(params.get("userId").toString());
        Long technicianId = Long.valueOf(params.get("technicianId").toString());
        Long batchId = Long.valueOf(params.get("batchId").toString());
        Integer quantity = Integer.valueOf(params.get("quantity").toString());
        
        OrderMaster order = orderService.createOrder(userId, technicianId, batchId, 
            quantity, new BigDecimal("299.00"));
        
        Map<String, Object> result = new HashMap<>();
        result.put("orderId", order.getId());
        return Result.success(result);
    }
    
    @PostMapping("/order/pay")
    public Result<Void> payOrder(@RequestBody Map<String, Object> params) {
        Long orderId = Long.valueOf(params.get("orderId").toString());
        orderService.paySuccess(orderId, "WX" + System.currentTimeMillis());
        return Result.success();
    }
}
