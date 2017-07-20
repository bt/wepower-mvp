package net.metasite.smartenergy.api.plant.response;

public class CreatedPlantDTO {
    private Long plantId;

    public CreatedPlantDTO(Long plantId) {
        this.plantId = plantId;
    }

    public Long getPlantId() {
        return plantId;
    }
}
