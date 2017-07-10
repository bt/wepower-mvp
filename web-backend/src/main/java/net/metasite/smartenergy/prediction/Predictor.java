package net.metasite.smartenergy.prediction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

import com.google.common.collect.Range;

public interface Predictor {
    Map<LocalDate, BigDecimal> predict(Range<LocalDate> period);
}
