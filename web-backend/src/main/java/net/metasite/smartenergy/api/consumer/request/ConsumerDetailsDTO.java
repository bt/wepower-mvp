package net.metasite.smartenergy.api.consumer.request;

import java.math.BigDecimal;

public class ConsumerDetailsDTO {
    private String walletId;
    private String areaCode;
    private String meterId;
    private BigDecimal consumption;
    private String houseSizeCode;

    public ConsumerDetailsDTO() {
    }

    public void setWalletId(String walletId) {
        this.walletId = walletId;
    }

    public void setAreaCode(String areaCode) {
        this.areaCode = areaCode;
    }

    public void setMeterId(String meterId) {
        this.meterId = meterId;
    }

    public void setConsumption(BigDecimal consumption) {
        this.consumption = consumption;
    }

    public void setHouseSizeCode(String houseSizeCode) {
        this.houseSizeCode = houseSizeCode;
    }

    public String getWalletId() {
        return walletId;
    }

    public String getAreaCode() {
        return areaCode;
    }

    public String getMeterId() {
        return meterId;
    }

    public BigDecimal getConsumption() {
        return consumption;
    }

    public String getHouseSizeCode() {
        return houseSizeCode;
    }
}
