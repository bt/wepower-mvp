package net.metasite.smartenergy.plant;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import net.metasite.smartenergy.domain.ActivePeriod;
import net.metasite.smartenergy.domain.Coordinates;
import net.metasite.smartenergy.domain.Plant;
import net.metasite.smartenergy.domain.ProductionLog;
import net.metasite.smartenergy.domain.SupportedLocationArea;
import net.metasite.smartenergy.prediction.Predictor;
import net.metasite.smartenergy.prediction.ProductionPredictor;
import net.metasite.smartenergy.repositories.PlantRepository;
import net.metasite.smartenergy.repositories.SupportedLocationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.common.collect.Range;

import static com.google.common.collect.Range.closed;
import static net.metasite.smartenergy.domain.ProductionLog.buildPrediction;

@Service
public class PlantFactory {

    private SupportedLocationRepository supportedLocationRepository;

    private PlantRepository plantRepository;

    @Autowired
    public PlantFactory(
            SupportedLocationRepository supportedLocationRepository,
            PlantRepository plantRepository) {
        this.supportedLocationRepository = supportedLocationRepository;
        this.plantRepository = plantRepository;
    }

    @Transactional
    public Long create(
            String walletId,
            String name,
            Plant.Type type,
            BigDecimal capacity,
            BigDecimal latitude,
            BigDecimal longtitude,
            String areaCode,
            Range<LocalDate> activeAt) {

        SupportedLocationArea locationArea = supportedLocationRepository.findByCode(areaCode);

        LocalDate periodStart = activeAt.lowerEndpoint();
        LocalDate periodEnd = activeAt.hasUpperBound() ? activeAt.upperEndpoint() : null;

        ActivePeriod period = new ActivePeriod(periodStart, periodEnd);

        Predictor predictor = new ProductionPredictor(capacity.intValue(), type, locationArea);
        Map<LocalDate, BigDecimal> predictedUsage = predictor.predict(closed(periodStart, periodEnd));

        List<ProductionLog> usageLogs = predictedUsage.entrySet()
                .stream()
                .map(predictionEntry -> buildPrediction(predictionEntry.getKey(), predictionEntry.getValue()))
                .collect(Collectors.toList());

        Plant newPlant = new Plant(
                walletId,
                name,
                type,
                capacity,
                Coordinates.at(latitude, longtitude),
                locationArea,
                period,
                false
        );

        newPlant.assignLogs(usageLogs);
        newPlant.mockProduction(closed(periodStart, periodEnd));

        plantRepository.save(newPlant);
        return newPlant.getId();
    }
}
