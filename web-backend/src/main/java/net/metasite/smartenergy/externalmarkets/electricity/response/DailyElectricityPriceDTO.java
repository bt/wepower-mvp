package net.metasite.smartenergy.externalmarkets.electricity.response;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;

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
