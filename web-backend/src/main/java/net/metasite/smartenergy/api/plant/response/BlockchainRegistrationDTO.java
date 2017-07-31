package net.metasite.smartenergy.api.plant.response;

import java.util.List;

public class BlockchainRegistrationDTO {

    private PlantDetailsResponseDTO plant;

    private List<PredictionDTO> predictions;

    public BlockchainRegistrationDTO(
            PlantDetailsResponseDTO plant,
            List<PredictionDTO> predictions) {

        this.plant = plant;
        this.predictions = predictions;
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
}
