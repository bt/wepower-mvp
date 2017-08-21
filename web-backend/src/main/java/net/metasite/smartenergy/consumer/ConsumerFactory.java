package net.metasite.smartenergy.consumer;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import net.metasite.smartenergy.domain.Consumer;
import net.metasite.smartenergy.domain.ConsumptionLog;
import net.metasite.smartenergy.domain.SupportedHouseSize;
import net.metasite.smartenergy.domain.SupportedLocationArea;
import net.metasite.smartenergy.prediction.ConsumptionPredictor;
import net.metasite.smartenergy.prediction.Predictor;
import net.metasite.smartenergy.repositories.ConsumerRepository;
import net.metasite.smartenergy.repositories.SupportedHouseSizeRepository;
import net.metasite.smartenergy.repositories.SupportedLocationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.google.common.collect.Range.closed;
import static java.time.LocalDate.now;
import static net.metasite.smartenergy.domain.ConsumptionLog.buildPrediction;

@Service
public class ConsumerFactory {

    private SupportedLocationRepository supportedLocationArea;

    private SupportedHouseSizeRepository supportedHouseSizeRepository;

    private ConsumerRepository consumerRepository;

    @Autowired
    public ConsumerFactory(
            SupportedLocationRepository supportedLocationArea,
            SupportedHouseSizeRepository supportedHouseSizeRepository,
            ConsumerRepository consumerRepository) {
        this.supportedLocationArea = supportedLocationArea;
        this.supportedHouseSizeRepository = supportedHouseSizeRepository;
        this.consumerRepository = consumerRepository;
    }

    @Transactional
    public Long create(
            String walletId,
            String areaCode,
            String meterId,
            BigDecimal consumption,
            String houseSizeCode,
            LocalDate consumeFrom,
            LocalDate consumeTo) {

        SupportedLocationArea locationArea = supportedLocationArea.findByCode(areaCode);
        SupportedHouseSize houseSize = supportedHouseSizeRepository.findByCode(houseSizeCode);

        Predictor predictor = new ConsumptionPredictor(houseSize);
        Map<LocalDate, BigDecimal> predictedUsage =
                predictor.predict(closed(consumeFrom, consumeTo));

        List<ConsumptionLog> usageLogs = predictedUsage.entrySet().stream()
                .map(predictionEntry -> buildPrediction(predictionEntry.getKey(), predictionEntry.getValue()))
                .collect(Collectors.toList());

        Consumer consumer = new Consumer(
                walletId,
                meterId,
                consumption,
                locationArea,
                houseSize,
                false
        );

        consumer.assignLogs(usageLogs);

        consumerRepository.save(consumer);

        return consumer.getId();
    }
}
