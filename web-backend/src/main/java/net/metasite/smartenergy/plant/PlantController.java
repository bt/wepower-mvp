package net.metasite.smartenergy.plant;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import net.metasite.smartenergy.domain.Plant;
import net.metasite.smartenergy.domain.ProductionLog;
import net.metasite.smartenergy.plant.request.PlantDetailsDTO;
import net.metasite.smartenergy.plant.response.CreatedPlantDTO;
import net.metasite.smartenergy.plant.response.PredictionDTO;
import net.metasite.smartenergy.repositories.PlantRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.Range;

@RestController
@RequestMapping("/plant")
public class PlantController {

    @Resource
    private PlantFactory plantFactory;

    @Resource
    private PlantRepository plantRepository;

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

    @GetMapping("{wallet}/production/predicted")
    public ResponseEntity<List<PredictionDTO>> getPredictedConsumption(
            @PathVariable(name = "wallet") String wallet,
            @RequestParam(name = "from") String from,
            @RequestParam(name = "to") String to) {

        Plant plant = plantRepository.findByWalletId(wallet);

        List<ProductionLog> productionPredictions = plant.productionPredictionsForPeriod(
                Range.closed(LocalDate.parse(from), LocalDate.parse(to))
        );

        List<PredictionDTO> responsePredictions = productionPredictions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responsePredictions);
    }

    public PredictionDTO convertToDTO(ProductionLog log) {
        return new PredictionDTO(log.getDate(), log.getAmount());
    }
}
