package net.metasite.smartenergy.api.plant.response;

import java.time.LocalDate;

public class ProductionAvailabilityDTO {

    private LocalDate from;
    private LocalDate to;

    public ProductionAvailabilityDTO() {
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
