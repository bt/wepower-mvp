package net.metasite.smartenergy.api.plant;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.function.BiConsumer;
import java.util.function.BinaryOperator;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.annotation.Resource;

import net.metasite.smartenergy.api.plant.response.PlantDetailsResponseDTO;
import net.metasite.smartenergy.domain.Plant;
import net.metasite.smartenergy.domain.ProductionLog;
import net.metasite.smartenergy.api.plant.request.PlantDetailsDTO;
import net.metasite.smartenergy.api.plant.response.CreatedPlantDTO;
import net.metasite.smartenergy.api.plant.response.DailyPlantReviewDTO;
import net.metasite.smartenergy.api.plant.response.PredictionDTO;
import net.metasite.smartenergy.plant.PlantManager;
import net.metasite.smartenergy.repositories.PlantRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.collect.ImmutableSet;
import com.google.common.collect.Range;

@RestController
@RequestMapping("/plant")
public class PlantController {

    private static final Logger LOG = LoggerFactory.getLogger(PlantController.class);

    @Resource
    private PlantManager plantManager;

    @Resource
    private PlantRepository plantRepository;

    /**
     * Controller is, and will be used only by Front-end,
     * therefore we Ignore HTTP specification and instead of 201+location header
     * return 200 + resource Id in response body
     *
     * @param request
     * @return
     */
    @PostMapping
    public ResponseEntity<CreatedPlantDTO> createPlant(@RequestBody PlantDetailsDTO request) {

        if (plantManager.isTaken(request.getWalletId())) {
            String errorMessage = String.format("Wallet %s is already taken", request.getWalletId
                    ());
            LOG.error(errorMessage);
            return new ResponseEntity(errorMessage, HttpStatus.BAD_REQUEST);
        }

        Long plantId = plantManager.persistPlantForm(
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

    @GetMapping("{wallet}")
    public ResponseEntity<PlantDetailsResponseDTO> getPlant(
            @PathVariable("wallet") String walletId) {

        Plant plant = plantRepository.findByWalletIdIgnoreCase(walletId);

        if (plant == null) {
            LOG.error("Plant {} not found", walletId);
            return ResponseEntity.notFound().build();
        }

        PlantDetailsResponseDTO responseDetails = new PlantDetailsResponseDTO(
                plant.getWalletId(),
                PlantDetailsResponseDTO.Type.valueOf(plant.getType().name())
        );

        return ResponseEntity.ok(responseDetails);
    }

    @PostMapping("{wallet}/activate")
    public ResponseEntity<Void> activateConsumer(
            @PathVariable(name = "wallet") String wallet) {

        Plant plant = plantRepository.findByWalletIdIgnoreCase(wallet);

        if (plant == null) {
            LOG.error("Consumer {} not found", wallet);
            return ResponseEntity.notFound().build();
        }

        plantManager.activate(wallet);

        return ResponseEntity.ok().build();
    }

    @GetMapping("{wallet}/production/predicted")
    public ResponseEntity<List<PredictionDTO>> getPredictedConsumption(
            @PathVariable(name = "wallet") String wallet,
            @RequestParam(name = "from") String from,
            @RequestParam(name = "to") String to) {

        Plant plant = plantRepository.findByWalletIdIgnoreCase(wallet);

        if (plant == null) {
            LOG.error("Plant {} not found", wallet);
            return ResponseEntity.notFound().build();
        }

        List<ProductionLog> productionPredictions = plant.productionPredictionsForPeriod(
                Range.closed(LocalDate.parse(from), LocalDate.parse(to))
        );

        List<PredictionDTO> responsePredictions = productionPredictions.stream()
                .sorted((o1, o2) -> o1.getDate().isAfter(o2.getDate()) ? 1 : -1)
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responsePredictions);
    }

    public PredictionDTO convertToDTO(ProductionLog log) {
        return new PredictionDTO(log.getDate(), log.getAmount());
    }

    @GetMapping("{wallet}/production/predicted/total")
    public ResponseEntity<BigDecimal> getPredictedConsumptionTotal(
            @PathVariable(name = "wallet") String wallet,
            @RequestParam(name = "from") String from,
            @RequestParam(name = "to") String to) {

        Plant plant = plantRepository.findByWalletIdIgnoreCase(wallet);

        if (plant == null) {
            LOG.error("Plant {} not found", wallet);
            return ResponseEntity.notFound().build();
        }

        BigDecimal totalProductionForPeriod = plant.totalProductionPredictionForPeriod(
                Range.closed(LocalDate.parse(from), LocalDate.parse(to))
        );

        return ResponseEntity.ok(totalProductionForPeriod);
    }

    @GetMapping("{wallet}/production/predicted/review")
    public ResponseEntity<List<DailyPlantReviewDTO>> getPredictedConsumptionReview(
            @PathVariable(name = "wallet") String wallet,
            @RequestParam(name = "from") String from,
            @RequestParam(name = "to") String to) {

        Plant plant = plantRepository.findByWalletIdIgnoreCase(wallet);

        if (plant == null) {
            LOG.error("Plant {} not found", wallet);
            return ResponseEntity.notFound().build();
        }

        List<ProductionLog> productionPredictions = plant.productionPredictionsForPeriod(
                Range.closed(LocalDate.parse(from), LocalDate.parse(to))
        );

        List<ProductionLog> production = plant.productionForPeriod(
                Range.closed(LocalDate.parse(from), LocalDate.parse(to))
        );

        List<DailyPlantReviewDTO> reviews =
                Stream.concat(production.stream(), productionPredictions.stream())
                        .collect(Collectors.groupingBy(o -> o.getDate(), new ProductionCollector()))
                        .values()
                        .stream()
                        .sorted((o1, o2) -> o1.getDate().isAfter(o2.getDate()) ? 1 : -1)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(reviews);
    }

    private class ProductionCollector implements Collector<ProductionLog, DailyPlantReviewDTO,
            DailyPlantReviewDTO> {

        @Override
        public Supplier<DailyPlantReviewDTO> supplier() {
            return DailyPlantReviewDTO::new;
        }

        @Override
        public BiConsumer<DailyPlantReviewDTO, ProductionLog> accumulator() {
            return (review, log) -> {
                review.setDate(log.getDate());
                if (log.isProduction()) {
                    review.setProducedAmount(log.getAmount());
                } else {
                    review.setPredictedAmount(log.getAmount());
                }
            };
        }

        @Override
        public BinaryOperator<DailyPlantReviewDTO> combiner() {
            return DailyPlantReviewDTO::merge;
        }

        @Override
        public Function finisher() {
            return Function.identity();
        }

        @Override
        public Set<Characteristics> characteristics() {
            return ImmutableSet.of(Characteristics.IDENTITY_FINISH);
        }
    }
}
