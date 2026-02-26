package com.wine.domain.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("wine_deposit_batch")
public class WineDepositBatch implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("batch_no")
    private String batchNo;

    @TableField("user_id")
    private Long userId;

    @TableField("product_id")
    private Long productId;

    @TableField("product_name")
    private String productName;

    @TableField("quantity")
    private Integer quantity;

    @TableField("available_quantity")
    private Integer availableQuantity;

    @TableField("frozen_quantity")
    private Integer frozenQuantity;

    @TableField("used_quantity")
    private Integer usedQuantity;

    @TableField("deposit_status")
    private Integer depositStatus;

    @TableField("payment_amount")
    private BigDecimal paymentAmount;

    @TableField("expired_date")
    private java.time.LocalDate expiredDate;

    @TableField("version")
    @Version
    private Integer version;

    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
