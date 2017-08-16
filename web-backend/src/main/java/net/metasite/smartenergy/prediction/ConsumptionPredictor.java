package net.metasite.smartenergy.prediction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

import net.metasite.smartenergy.domain.SupportedHouseSize;
import net.metasite.smartenergy.prediction.Predictor;

import com.google.common.collect.Range;

public class ConsumptionPredictor implements Predictor {


    public static final int BASE_CONSUMPTION_FOR_DAY = 15;
    public static final float VARIATION = 0.2f;

    private SupportedHouseSize size;

    public ConsumptionPredictor(SupportedHouseSize size) {
        this.size = size;
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
        int absoluteVariation = Math.round(BASE_CONSUMPTION_FOR_DAY * VARIATION);

        Map<LocalDate, BigDecimal> predictions = new HashMap<>();
        
        for (LocalDate predictionDay = period.lowerEndpoint();
             period.contains(predictionDay);
             predictionDay = predictionDay.plusDays(1)) {

            // After geting deviation, we subtract amplitude of change, in order to also get negative variation
            int randomDeviation = ThreadLocalRandom.current().nextInt(absoluteVariation * 2 + 1) - absoluteVariation;
            int baseSizePrediction = BASE_CONSUMPTION_FOR_DAY + randomDeviation;

            predictions.put(predictionDay, adjustPredictionToSize(baseSizePrediction, size));
        }

        return predictions;
    }


    private BigDecimal adjustPredictionToSize(int prediction, SupportedHouseSize size) {
        if (size.getCode().equals("S")) {
            return BigDecimal.valueOf(Math.round(prediction / 4));
        } else if (size.getCode().equals("M")) {
            return BigDecimal.valueOf(Math.round(prediction / 2));
        } else {
            return BigDecimal.valueOf(prediction);
        }
    }
}
