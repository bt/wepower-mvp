package net.metasite.smartenergy.externalmarkets.electricity.externalapi;

import java.math.BigDecimal;

public class IntervalDTO {

    private BigDecimal price;

    public IntervalDTO() {
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}
