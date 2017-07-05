package net.metasite.smartenergy.plant;

import javax.annotation.Resource;

import net.metasite.smartenergy.domain.Plant;
import net.metasite.smartenergy.plant.request.PlantDetailsDTO;
import net.metasite.smartenergy.plant.response.CreatedPlantDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.collect.Range;

@RestController
@RequestMapping("/plant")
public class PlantController {

    @Resource
    private PlantFactory plantFactory;

    /**
     * Controller is, and will be used only by Front-end,
     *  therefore we Ignore HTTP specification and instead of 201+location header
     *  return 200 + resource Id in response body
     *
     * @param request
     * @return
     */
    @PostMapping
    public ResponseEntity<CreatedPlantDTO> createPlant(@RequestBody PlantDetailsDTO request) {
        Long plantId = plantFactory.create(
                request.getWalletId(),
                request.getName(),
                Plant.Type.valueOf(request.getType().name()),
                request.getCapacity(),
                request.getLocationLatitude(),
                request.getLocationLongtitude(),
                request.getAreaCode(),
                Range.closed(request.getProduceFrom(), request.getProduceTo())
        );

        return ResponseEntity.ok(new CreatedPlantDTO(plantId));
    }
}
