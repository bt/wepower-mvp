package net.metasite.smartenergy.api.plant.response;

import java.util.List;

public class BlockchainRegistrationDTO {

    private PlantDetailsResponseDTO plant;

    private List<PredictionDTO> preditions;

    public BlockchainRegistrationDTO(
            PlantDetailsResponseDTO plant,
            List<PredictionDTO> preditions) {

        this.plant = plant;
        this.preditions = preditions;
    }

    public PlantDetailsResponseDTO getPlant() {
        return plant;
    }

    public void setPlant(PlantDetailsResponseDTO plant) {
        this.plant = plant;
    }

    public List<PredictionDTO> getPreditions() {
        return preditions;
    }

    public void setPreditions(List<PredictionDTO> preditions) {
        this.preditions = preditions;
    }
}
