package net.metasite.smartenergy.plant.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public class DailyPlantReviewDTO {

    private LocalDate date;
    private BigDecimal predictedAmount;
    private BigDecimal producedAmount;

    public DailyPlantReviewDTO() {
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setPredictedAmount(BigDecimal predictedAmount) {
        this.predictedAmount = predictedAmount;
    }

    public void setProducedAmount(BigDecimal producedAmount) {
        this.producedAmount = producedAmount;
    }

    public LocalDate getDate() {
        return date;
    }

    public BigDecimal getPredictedAmount() {
        return predictedAmount;
    }

    public BigDecimal getProducedAmount() {
        return producedAmount;
    }

    public static DailyPlantReviewDTO merge(DailyPlantReviewDTO review1, DailyPlantReviewDTO review2) {
        DailyPlantReviewDTO mergedReview = new DailyPlantReviewDTO();
        mergedReview.setDate(review1.getDate());
        mergedReview.setPredictedAmount(
                review1.getPredictedAmount() != null ?
                        review1.getPredictedAmount() : review2.getPredictedAmount());
        mergedReview.setProducedAmount(review1.getProducedAmount() != null ? review1.getProducedAmount() : review2.getProducedAmount());
        return mergedReview;
    }


}
