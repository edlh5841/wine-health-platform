package com.wine.domain.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("technician")
public class Technician implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("user_id")
    private Long userId;

    @TableField("real_name")
    private String realName;

    @TableField("cert_no")
    private String certNo;

    @TableField("avatar")
    private String avatar;

    @TableField("work_years")
    private Integer workYears;

    @TableField("current_lat")
    private BigDecimal currentLat;

    @TableField("current_lon")
    private BigDecimal currentLon;

    @TableField("account_status")
    private Integer accountStatus;

    @TableField("online_status")
    private Integer onlineStatus;

    @TableField("balance")
    private BigDecimal balance;

    @TableField("rating_score")
    private BigDecimal ratingScore;

    @TableField("order_count")
    private Integer orderCount;

    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
