package net.metasite.smartenergy.consumer;

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

import net.metasite.smartenergy.consumer.request.ConsumerDetailsDTO;
import net.metasite.smartenergy.consumer.response.CreatedConsumerDTO;
import net.metasite.smartenergy.consumer.response.DailyConsumerReviewDTO;
import net.metasite.smartenergy.consumer.response.PredictionDTO;
import net.metasite.smartenergy.domain.Consumer;
import net.metasite.smartenergy.domain.ConsumptionLog;
import net.metasite.smartenergy.repositories.ConsumerRepository;

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
@RequestMapping("/consumer")
public class ConsumerController {

    @Resource
    private ConsumerFactory consumerFactory;

    @Resource
    private ConsumerRepository consumerRepository;

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
            @RequestBody ConsumerDetailsDTO request) {

        Long consumerId = consumerFactory.create(
                request.getWalletId(),
                request.getAreaCode(),
                request.getMeterId(),
                request.getConsumption(),
                request.getHouseSizeCode()
        );

        return ResponseEntity.ok(new CreatedConsumerDTO(consumerId));
    }


    @GetMapping("{wallet}/consumption/predicted")
    public ResponseEntity<List<PredictionDTO>> getPredictedConsumption(
            @PathVariable(name = "wallet") String wallet,
            @RequestParam(name = "from") String from,
            @RequestParam(name = "to") String to) {

        Consumer consumer = consumerRepository.findByWalletId(wallet);

        List<ConsumptionLog> predictionsForPeriod = consumer.consumptionPredictionsForPeriod(
                Range.closed(LocalDate.parse(from), LocalDate.parse(to))
        );

        List<PredictionDTO> responsePredictions = predictionsForPeriod.stream()
                .sorted((o1, o2) -> o1.getDate().isAfter(o2.getDate()) ? 1 : -1)
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responsePredictions);
    }

    public PredictionDTO convertToDTO(ConsumptionLog log) {
        return new PredictionDTO(log.getDate(), log.getAmount());
    }

    @GetMapping("{wallet}/production/predicted/total")
    public ResponseEntity<BigDecimal> getPredictedConsumptionTotal(
            @PathVariable(name = "wallet") String wallet,
            @RequestParam(name = "from") String from,
            @RequestParam(name = "to") String to) {

        Consumer consumer = consumerRepository.findByWalletId(wallet);

        BigDecimal totalProductionForPeriod = consumer.totalConsumptionPredictionForPeriod(
                Range.closed(LocalDate.parse(from), LocalDate.parse(to))
        );

        return ResponseEntity.ok(totalProductionForPeriod);
    }

    @GetMapping("{wallet}/production/predicted/review")
    public ResponseEntity<List<DailyConsumerReviewDTO>> getPredictedConsumptionReview(
            @PathVariable(name = "wallet") String wallet,
            @RequestParam(name = "from") String from,
            @RequestParam(name = "to") String to) {

        Consumer consumer = consumerRepository.findByWalletId(wallet);


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
