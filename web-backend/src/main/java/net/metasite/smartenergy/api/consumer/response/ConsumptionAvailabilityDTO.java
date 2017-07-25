package net.metasite.smartenergy.api.consumer.response;

import java.time.LocalDate;

public class ConsumptionAvailabilityDTO {

    private LocalDate from;
    private LocalDate to;

    public ConsumptionAvailabilityDTO() {
    }

    public LocalDate getFrom() {
        return from;
    }

    public void setFrom(LocalDate from) {
        this.from = from;
    }

    public LocalDate getTo() {
        return to;
    }

    public void setTo(LocalDate to) {
        this.to = to;
    }
}
