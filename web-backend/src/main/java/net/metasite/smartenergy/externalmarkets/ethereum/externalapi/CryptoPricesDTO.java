package net.metasite.smartenergy.externalmarkets.ethereum.externalapi;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CryptoPricesDTO {

    private String id;

    @JsonProperty("price_eur")
    private BigDecimal priceEur;

    public CryptoPricesDTO() {
    }

    public BigDecimal getPriceEur() {
        return priceEur;
    }

    public void setPriceEur(BigDecimal priceEur) {
        this.priceEur = priceEur;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
