package net.metasite.smartenergy.api.electricitymarket.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public class DailyElectricityPriceDTO {

    private LocalDate date;

    private BigDecimal price;

    public DailyElectricityPriceDTO() {
    }

    public DailyElectricityPriceDTO(LocalDate date, BigDecimal price) {
        this.date = date;
        this.price = price;
    }

    public LocalDate getDate() {
        return date;
    }

    public BigDecimal getPrice() {
        return price;
    }
}
