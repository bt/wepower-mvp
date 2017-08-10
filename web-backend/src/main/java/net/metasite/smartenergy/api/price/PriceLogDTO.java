package net.metasite.smartenergy.api.price;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PriceLogDTO {

    private String plant;
    private LocalDate date;
    private BigDecimal price;

    public String getPlant() {
        return plant;
    }

    public LocalDate getDate() {
        return date;
    }

    public BigDecimal getPrice() {
        return price;
    }
}
