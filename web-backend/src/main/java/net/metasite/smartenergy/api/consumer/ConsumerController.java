package net.metasite.smartenergy.api.consumer;

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
import javax.servlet.http.HttpServletRequest;

import net.metasite.smartenergy.api.consumer.request.ConsumerDetailsDTO;
import net.metasite.smartenergy.api.consumer.response.ConsumptionAvailabilityDTO;
import net.metasite.smartenergy.api.consumer.response.CreatedConsumerDTO;
import net.metasite.smartenergy.api.consumer.response.DailyConsumerReviewDTO;
import net.metasite.smartenergy.api.consumer.response.PredictionDTO;
import net.metasite.smartenergy.consumer.ConsumerManager;
import net.metasite.smartenergy.domain.Consumer;
import net.metasite.smartenergy.domain.ConsumptionLog;
import net.metasite.smartenergy.repositories.ConsumerRepository;
import net.metasite.smartenergy.usedip.UsedIpManager;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpRequest;
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

import static java.lang.String.format;

@RestController
@RequestMapping("/consumer")
public class ConsumerController {

    public static final Logger LOG = LoggerFactory.getLogger(ConsumerController.class);
    @Resource
    private ConsumerManager consumerManagementService;

    @Resource
    private ConsumerRepository consumerRepository;

    @Resource
    private UsedIpManager usedIpManager;

    /**
     * Controller is, and will be used only by Front-end,
     *  therefore we Ignore HTTP specification and instead of 201+location header
     *  return 200 + resource Id in response body
     *
     * @param request
     * @return
     */
    @PostMapping
    public ResponseEntity<CreatedConsumerDTO> createConsumer(
            @RequestBody ConsumerDetailsDTO request, HttpServletRequest httpRequest) {

        String ip = httpRequest.getHeader("X-Real-IP");
        LOG.debug("Creating account for {}", ip);
        if (ip != null && !usedIpManager.isAllowed(ip)) {
            String errorMessage = "There are already max allowed consumers registerd on this ip address";
            LOG.error(errorMessage);
            return new ResponseEntity(errorMessage, HttpStatus.BAD_REQUEST);
        }

        if (consumerManagementService.isTaken(request.getWalletId())) {
            String errorMessage = String.format("Wallet %s is already taken", request.getWalletId());
            LOG.error(errorMessage);
            return new ResponseEntity(errorMessage, HttpStatus.BAD_REQUEST);
        }

        Long consumerId = consumerManagementService.persistConsumerForm(
                request.getWalletId(),
                request.getAreaCode(),
                request.getMeterId(),
                request.getConsumption(),
                request.getHouseSizeCode(),
                request.getConsumeFrom(),
                request.getConsumeTo());

        usedIpManager.addAcc(ip);

        return ResponseEntity.ok(new CreatedConsumerDTO(consumerId));
    }

    @PostMapping("{wallet}/activate")
    public ResponseEntity<Void> activateConsumer(
            @PathVariable(name = "wallet") String wallet) {

        Consumer consumer = consumerRepository.findByWalletIdIgnoreCase(wallet);

        if (consumer == null) {
            LOG.error("Consumer {} not found", wallet);
            return ResponseEntity.notFound().build();
        }

        consumerManagementService.activate(wallet);

        return ResponseEntity.ok().build();
    }


    @GetMapping("{wallet}/consumption/predicted")
    public ResponseEntity<List<PredictionDTO>> getPredictedConsumption(
            @PathVariable(name = "wallet") String wallet,
            @RequestParam(name = "from") String from,
            @RequestParam(name = "to") String to) {

        Consumer consumer = consumerRepository.findByWalletIdIgnoreCase(wallet);

        if (consumer == null) {
            String errorMessage = "Consumer not found";
            LOG.error(errorMessage);
            return new ResponseEntity(errorMessage, HttpStatus.NOT_FOUND);
        }

        List<ConsumptionLog> predictionsForPeriod = consumer.consumptionPredictionsForPeriod(
                Range.closed(LocalDate.parse(from), LocalDate.parse(to))
        );

        List<PredictionDTO> responsePredictions = predictionsForPeriod.stream()
                .sorted((o1, o2) -> o1.getDate().isAfter(o2.getDate()) ? 1 : -1)
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responsePredictions);
    }



    @GetMapping("{wallet}/consumption/predicted/period")
    public ResponseEntity<ConsumptionAvailabilityDTO> getPredictionAvailability(
            @PathVariable(name = "wallet") String wallet) {

        Consumer consumer = consumerRepository.findByWalletIdIgnoreCase(wallet);

        if (consumer == null) {
            String errorMessage = "Consumer not found";
            LOG.error(errorMessage);
            return new ResponseEntity(errorMessage, HttpStatus.NOT_FOUND);
        }

        Range<LocalDate> predictionsForPeriod = consumer.predictedRange();

        ConsumptionAvailabilityDTO availabilityResponse = new ConsumptionAvailabilityDTO();
        availabilityResponse.setFrom(predictionsForPeriod.lowerEndpoint());
        availabilityResponse.setTo(predictionsForPeriod.upperEndpoint());

        return ResponseEntity.ok(availabilityResponse);
    }

    public PredictionDTO convertToDTO(ConsumptionLog log) {
        return new PredictionDTO(log.getDate(), log.getAmount());
    }

    @GetMapping("{wallet}/consumption/predicted/total")
    public ResponseEntity<BigDecimal> getPredictedConsumptionTotal(
            @PathVariable(name = "wallet") String wallet,
            @RequestParam(name = "from") String from,
            @RequestParam(name = "to") String to) {

        Consumer consumer = consumerRepository.findByWalletIdIgnoreCase(wallet);

        if (consumer == null) {
            String errorMessage = "Consumer not found";
            LOG.error(errorMessage);
            return new ResponseEntity(errorMessage, HttpStatus.NOT_FOUND);
        }

        BigDecimal totalProductionForPeriod = consumer.totalConsumptionPredictionForPeriod(
                Range.closed(LocalDate.parse(from), LocalDate.parse(to))
        );

        return ResponseEntity.ok(totalProductionForPeriod);
    }

    @GetMapping("{wallet}/consumption/predicted/review")
    public ResponseEntity<List<DailyConsumerReviewDTO>> getPredictedConsumptionReview(
            @PathVariable(name = "wallet") String wallet,
            @RequestParam(name = "from") String from,
            @RequestParam(name = "to") String to) {

        Consumer consumer = consumerRepository.findByWalletIdIgnoreCase(wallet);

        if (consumer == null) {
            String errorMessage = "Consumer not found";
            LOG.error(errorMessage);
            return new ResponseEntity(errorMessage, HttpStatus.NOT_FOUND);
        }

        List<ConsumptionLog> consumptionPredictions = consumer.consumptionPredictionsForPeriod(
                Range.closed(LocalDate.parse(from), LocalDate.parse(to))
        );

        List<ConsumptionLog> consumption = consumer.consumptionForPeriod(
                Range.closed(LocalDate.parse(from), LocalDate.parse(to))
        );

        List<DailyConsumerReviewDTO> reviews =
                Stream.concat(consumption.stream(), consumptionPredictions.stream())
                        .collect(Collectors.groupingBy(o -> o.getDate(), new ConsumptionCollector()))
                        .values()
                        .stream()
                        .sorted((o1, o2) -> o1.getDate().isAfter(o2.getDate()) ? 1 : -1)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(reviews);
    }

    private class ConsumptionCollector implements Collector<ConsumptionLog, DailyConsumerReviewDTO, DailyConsumerReviewDTO> {

        @Override
        public Supplier<DailyConsumerReviewDTO> supplier() {
            return DailyConsumerReviewDTO::new;
        }

        @Override
        public BiConsumer<DailyConsumerReviewDTO, ConsumptionLog> accumulator() {
            return (review, log) -> {
                review.setDate(log.getDate());
                if (log.isConsumption()) {
                    review.setConsumedAmount(log.getAmount());
                } else {
                    review.setPredictedAmount(log.getAmount());
                }
            };
        }

        @Override
        public BinaryOperator<DailyConsumerReviewDTO> combiner() {
            return DailyConsumerReviewDTO::merge;
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
