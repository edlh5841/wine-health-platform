package com.wine.domain.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("order_master")
public class OrderMaster implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("order_no")
    private String orderNo;

    @TableField("user_id")
    private Long userId;

    @TableField("technician_id")
    private Long technicianId;

    @TableField("deposit_batch_id")
    private Long depositBatchId;

    @TableField("service_type")
    private Integer serviceType;

    @TableField("service_duration")
    private Integer serviceDuration;

    @TableField("predict_quantity")
    private Integer predictQuantity;

    @TableField("actual_quantity")
    private Integer actualQuantity;

    @TableField("order_amount")
    private BigDecimal orderAmount;

    @TableField("pay_amount")
    private BigDecimal payAmount;

    @TableField("pay_time")
    private LocalDateTime payTime;

    @TableField("transaction_id")
    private String transactionId;

    @TableField("status")
    private Integer status;

    @TableField("cancel_reason")
    private String cancelReason;

    @TableField("frozen_no")
    private String frozenNo;

    @TableField("write_off_no")
    private String writeOffNo;

    @TableField("version")
    @Version
    private Integer version;

    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    public enum Status {
        WAIT_PAY(0, "待支付"),
        WAIT_SERVICE(1, "待服务"),
        SERVICING(2, "服务中"),
        COMPLETED(3, "已完成"),
        CANCELLED(4, "已取消"),
        AFTER_SALE(5, "售后中");

        private final int code;
        private final String desc;

        Status(int code, String desc) {
            this.code = code;
            this.desc = desc;
        }

        public int getCode() {
            return code;
        }

        public String getDesc() {
            return desc;
        }
    }
}
