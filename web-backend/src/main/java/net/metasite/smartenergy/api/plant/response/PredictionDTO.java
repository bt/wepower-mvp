package net.metasite.smartenergy.api.plant.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PredictionDTO {
    private LocalDate date;
    private BigDecimal predictedAmount;

    public PredictionDTO() {
    }

    public PredictionDTO(LocalDate date, BigDecimal predictedAmount) {
        this.date = date;
        this.predictedAmount = predictedAmount;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public BigDecimal getPredictedAmount() {
        return predictedAmount;
    }

    public void setPredictedAmount(BigDecimal predictedAmount) {
        this.predictedAmount = predictedAmount;
    }
}
