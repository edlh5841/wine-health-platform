package com.wine.domain.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.wine.domain.entity.WineDepositBatch;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface WineDepositBatchMapper extends BaseMapper<WineDepositBatch> {
    
    @Update("UPDATE wine_deposit_batch SET " +
            "available_quantity = available_quantity - #{quantity}, " +
            "frozen_quantity = frozen_quantity + #{quantity}, " +
            "version = version + 1 " +
            "WHERE id = #{id} AND available_quantity >= #{quantity} AND version = #{version}")
    int freezeQuantity(@Param("id") Long id, @Param("quantity") Integer quantity, @Param("version") Integer version);
}
