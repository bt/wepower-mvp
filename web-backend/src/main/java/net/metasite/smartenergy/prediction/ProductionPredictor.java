package net.metasite.smartenergy.prediction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

import net.metasite.smartenergy.domain.Plant;
import net.metasite.smartenergy.domain.SupportedLocationArea;

import com.google.common.collect.Range;

public class ProductionPredictor implements Predictor {

    private int capacity;
    private Plant.Type type;
    private SupportedLocationArea area;

    public ProductionPredictor(int capacity, Plant.Type type, SupportedLocationArea area) {
        this.capacity = capacity;
        this.type = type;
        this.area = area;
    }

    /**
     * Provides fake predictions based on random number generation.
     * Real prediction will be implemented in later project phases.
     *
     * @param period
     * @param size
     * @return
     */
    @Override
    public Map<LocalDate, BigDecimal> predict(Range<LocalDate> period) {
        switch (type) {
        case SOLAR:
            return predict(period, 0.25f, 0.05f);
        case WIND:
            return predict(period, 0.5f, 0.3f);
        case HYDRO:
            default:
            return predict(period, 0.8f, 0.02f);
        }
    }

    private Map<LocalDate, BigDecimal> predict(
            Range<LocalDate> period,
            final float effectiveness,
            final float variation) {

        int absoluteVariation = Math.round(capacity * variation);

        Map<LocalDate, BigDecimal> predictions = new HashMap<>();

        for (LocalDate predictionDay = period.lowerEndpoint();
             period.contains(predictionDay);
             predictionDay = predictionDay.plusDays(1)) {

            // After geting deviation, we subtract amplitude of change, in order to also get negative variation
            int randomDeviation = ThreadLocalRandom.current().nextInt(absoluteVariation * 2 + 1) - absoluteVariation;
            int baseSizePrediction = Math.round(capacity * effectiveness) + randomDeviation;

            predictions.put(predictionDay, new BigDecimal(baseSizePrediction));
        }

        return predictions;
    }
}
