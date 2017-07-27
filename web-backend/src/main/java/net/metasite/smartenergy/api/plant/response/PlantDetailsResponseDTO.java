package net.metasite.smartenergy.api.plant.response;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import net.metasite.smartenergy.domain.ActivePeriod;
import net.metasite.smartenergy.domain.Plant;
import net.metasite.smartenergy.domain.ProductionLog;
import net.metasite.smartenergy.domain.SupportedLocationArea;

public class PlantDetailsResponseDTO {

    public enum Type {
        SOLAR, WIND, HYDRO
    }

    private String walletId;

    private PlantDetailsResponseDTO.Type type;

    public PlantDetailsResponseDTO() {
    }

    public PlantDetailsResponseDTO(String walletId, Type type) {
        this.walletId = walletId;
        this.type = type;
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
