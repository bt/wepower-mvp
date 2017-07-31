package net.metasite.smartenergy.api.plant.response;

import java.time.LocalDate;

public class PlantDetailsResponseDTO {

    public enum Type {
        SOLAR, WIND, HYDRO
    }

    private String walletId;

    private PlantDetailsResponseDTO.Type type;

    private LocalDate from;

    private LocalDate to;

    public PlantDetailsResponseDTO() {
    }

    public PlantDetailsResponseDTO(String walletId, Type type, LocalDate from, LocalDate to) {
        this.walletId = walletId;
        this.type = type;
        this.from = from;
        this.to = to;
    }

    public String getWalletId() {
        return walletId;
    }

    public void setWalletId(String walletId) {
        this.walletId = walletId;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }


}
