package com.wine.domain.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.wine.domain.entity.Technician;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TechnicianMapper extends BaseMapper<Technician> {
}
