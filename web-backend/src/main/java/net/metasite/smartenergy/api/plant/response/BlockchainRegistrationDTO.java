package net.metasite.smartenergy.api.plant.response;

import java.math.BigDecimal;
import java.util.List;

public class BlockchainRegistrationDTO {

    private PlantDetailsResponseDTO plant;

    private List<PredictionDTO> predictions;

    private BigDecimal currentMarketPrice;

    public BlockchainRegistrationDTO(
            PlantDetailsResponseDTO plant,
            List<PredictionDTO> predictions,
            BigDecimal currentMarketPrice) {

        this.plant = plant;
        this.predictions = predictions;
        this.currentMarketPrice = currentMarketPrice;
    }

    public PlantDetailsResponseDTO getPlant() {
        return plant;
    }

    public void setPlant(PlantDetailsResponseDTO plant) {
        this.plant = plant;
    }

    public List<PredictionDTO> getPredictions() {
        return predictions;
    }

    public void setPredictions(List<PredictionDTO> predictions) {
        this.predictions = predictions;
    }

    public BigDecimal getCurrentMarketPrice() {
        return currentMarketPrice;
    }

    public void setCurrentMarketPrice(BigDecimal currentMarketPrice) {
        this.currentMarketPrice = currentMarketPrice;
    }
}
