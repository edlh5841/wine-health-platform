package com.wine.service.tax;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class TaxCalculateService {

    /**
     * 计算技师个税（劳务报酬 20%-40%）
     */
    public TaxResult calculateTechnicianTax(BigDecimal income) {
        // 应纳税所得额 = 收入 × (1 - 20%)
        BigDecimal taxableAmount = income.multiply(new BigDecimal("0.80"));
        BigDecimal taxAmount;
        
        if (taxableAmount.compareTo(new BigDecimal("20000")) <= 0) {
            taxAmount = taxableAmount.multiply(new BigDecimal("0.20"));
        } else if (taxableAmount.compareTo(new BigDecimal("50000")) <= 0) {
            taxAmount = taxableAmount.multiply(new BigDecimal("0.30")).subtract(new BigDecimal("2000"));
        } else {
            taxAmount = taxableAmount.multiply(new BigDecimal("0.40")).subtract(new BigDecimal("7000"));
        }
        
        taxAmount = taxAmount.setScale(2, RoundingMode.HALF_UP);
        BigDecimal netAmount = income.subtract(taxAmount);
        
        return new TaxResult(taxAmount, netAmount, new BigDecimal("0.20"));
    }

    /**
     * 托管方增值税（简易计税3%）
     */
    public TaxResult calculateDepositVAT(BigDecimal income) {
        BigDecimal taxRate = new BigDecimal("0.03");
        BigDecimal taxAmount = income.multiply(taxRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal netAmount = income.subtract(taxAmount);
        return new TaxResult(taxAmount, netAmount, taxRate);
    }

    /**
     * 平台企业所得税（25%）
     */
    public TaxResult calculatePlatformTax(BigDecimal income) {
        BigDecimal taxRate = new BigDecimal("0.25");
        BigDecimal taxAmount = income.multiply(taxRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal netAmount = income.subtract(taxAmount);
        return new TaxResult(taxAmount, netAmount, taxRate);
    }

    public static class TaxResult {
        public BigDecimal taxAmount;
        public BigDecimal netAmount;
        public BigDecimal taxRate;

        public TaxResult(BigDecimal taxAmount, BigDecimal netAmount, BigDecimal taxRate) {
            this.taxAmount = taxAmount;
            this.netAmount = netAmount;
            this.taxRate = taxRate;
        }
    }
}
