package net.metasite.smartenergy.plant;

import net.metasite.smartenergy.plant.request.PlantDetailsDTO;
import net.metasite.smartenergy.plant.response.CreatedPlantDTO;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.HttpStatus.CREATED;


@RestController
@RequestMapping("/plant")
public class PlantController {

    @PostMapping
    public ResponseEntity<CreatedPlantDTO> createPlant(@RequestBody PlantDetailsDTO request) {
        // TODO: Implement persistance.

        return ResponseEntity.ok(new CreatedPlantDTO(1L));
    }
}
