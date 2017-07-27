package net.metasite.smartenergy.api.plant.request;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PlantDetailsDTO {

    public enum Type {
        SOLAR, WIND, HYDRO
    }

    private String name;
    private String walletId;
    private String areaCode;
    private BigDecimal capacity;
    private Type type;

    private LocalDate produceFrom;
    private LocalDate produceTo;

    public PlantDetailsDTO() {
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setWalletId(String walletId) {
        this.walletId = walletId;
    }

    public void setAreaCode(String areaCode) {
        this.areaCode = areaCode;
    }

    public void setCapacity(BigDecimal capacity) {
        this.capacity = capacity;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public void setProduceFrom(LocalDate produceFrom) {
        this.produceFrom = produceFrom;
    }

    public void setProduceTo(LocalDate produceTo) {
        this.produceTo = produceTo;
    }

    public String getName() {
        return name;
    }

    public String getWalletId() {
        return walletId;
    }

    public String getAreaCode() {
        return areaCode;
    }

    public BigDecimal getCapacity() {
        return capacity;
    }

    public Type getType() {
        return type;
    }

    public LocalDate getProduceFrom() {
        return produceFrom;
    }

    public LocalDate getProduceTo() {
        return produceTo;
    }
}
