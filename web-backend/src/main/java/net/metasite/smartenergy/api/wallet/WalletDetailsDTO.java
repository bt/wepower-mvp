package net.metasite.smartenergy.api.wallet;

public class WalletDetailsDTO {
    public enum WalletType {
        PLANT, CONSUMER
    }

    public enum ProductionType {
        SOLAR, WIND, HYDRO
    }

    public WalletType type;
    public ProductionType productionType;
    public boolean active;

    public WalletDetailsDTO() {
    }

    public WalletDetailsDTO(WalletType type, ProductionType subType, boolean active) {
        this.type = type;
        this.productionType = subType;
        this.active = active;
    }

    public WalletType getType() {
        return type;
    }

    public void setType(WalletType type) {
        this.type = type;
    }

    public ProductionType getProductionType() {
        return productionType;
    }

    public void setProductionType(ProductionType productionType) {
        this.productionType = productionType;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
