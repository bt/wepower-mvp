package net.metasite.smartenergy.externalmarkets.electricity;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PriceForDay {
    private LocalDate day;
    private BigDecimal price;

    public PriceForDay(LocalDate day, BigDecimal price) {
        this.day = day;
        this.price = price;
    }

    public LocalDate getDay() {
        return day;
    }

    public BigDecimal getMWhPrice() {
        return price;
    }

    public BigDecimal getkWhPrice() {
        return price.divide(new BigDecimal(1000));
    }
}