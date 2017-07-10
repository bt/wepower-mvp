package net.metasite.smartenergy.consumer;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import net.metasite.smartenergy.consumer.request.ConsumerDetailsDTO;
import net.metasite.smartenergy.consumer.response.CreatedConsumerDTO;
import net.metasite.smartenergy.consumer.response.PredictionDTO;
import net.metasite.smartenergy.domain.Consumer;
import net.metasite.smartenergy.domain.ConsumptionLog;
import net.metasite.smartenergy.repositories.ConsumerRepository;

import org.springframework.http.HttpStatus;
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
import jdk.nashorn.internal.ir.annotations.Immutable;

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
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responsePredictions);
    }

    public PredictionDTO convertToDTO(ConsumptionLog log) {
        return new PredictionDTO(log.getDate(), log.getAmount());
    }
}
