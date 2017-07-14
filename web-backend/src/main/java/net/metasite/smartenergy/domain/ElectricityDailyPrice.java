package net.metasite.smartenergy.domain;

import java.math.BigDecimal;
import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table
public class ElectricityDailyPrice {

    // Currently only one source is supported.
    public enum PriceSource {
        NORD_POOL
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column
    private LocalDate date;

    // Unit is considered to be MWh
    @Column
    private BigDecimal unitPrice;

    @Column
    @Enumerated(EnumType.STRING)
    private PriceSource source;

    // Curently region is ignored and set constant.
    @Column
    private String region = "LT";

    public ElectricityDailyPrice() {
    }

    public LocalDate getDate() {
        return date;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }
}
