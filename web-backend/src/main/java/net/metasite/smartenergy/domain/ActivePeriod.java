package net.metasite.smartenergy.domain;

import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class ActivePeriod {

    @Column(name = "active_from")
    private LocalDate from;

    @Column(name = "active_to")
    private LocalDate to;

    protected ActivePeriod() {
    }

    public ActivePeriod(LocalDate from, LocalDate to) {
        this.from = from;
        this.to = to;
    }

    public LocalDate getFrom() {
        return from;
    }

    public LocalDate getTo() {
        return to;
    }
}
