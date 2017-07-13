package net.metasite.smartenergy.consumer.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public class DailyConsumerReviewDTO {

    private LocalDate date;
    private BigDecimal predictedAmount;
    private BigDecimal consumedAmount;

    public DailyConsumerReviewDTO() {
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

    public BigDecimal getConsumedAmount() {
        return consumedAmount;
    }

    public void setConsumedAmount(BigDecimal consumedAmount) {
        this.consumedAmount = consumedAmount;
    }

    public static DailyConsumerReviewDTO merge(DailyConsumerReviewDTO review1, DailyConsumerReviewDTO review2) {
        DailyConsumerReviewDTO mergedReview = new DailyConsumerReviewDTO();
        mergedReview.setDate(review1.getDate());
        mergedReview.setPredictedAmount(
                review1.getPredictedAmount() != null ?
                        review1.getPredictedAmount() : review2.getPredictedAmount());
        mergedReview.setConsumedAmount(review1.getConsumedAmount() != null ? review1.getConsumedAmount() : review2.getConsumedAmount());
        return mergedReview;
    }


}
