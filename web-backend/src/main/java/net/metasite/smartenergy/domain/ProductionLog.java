package net.metasite.smartenergy.domain;

import java.math.BigDecimal;
import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(schema = "public", name = "production_log")
public class ProductionLog {

    public enum LogType {
        PREDICTION,
        CONSUMPTION
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column
    private LocalDate date;

    @Column
    private BigDecimal amount;

    @Column
    @Enumerated(EnumType.STRING)
    private LogType type;

    @ManyToOne
    @JoinColumn(name = "plant_id")
    private Plant plant;

    public ProductionLog() {
    }

    public static ProductionLog buildPrediction(LocalDate date, BigDecimal amount) {
        ProductionLog log = new ProductionLog();
        log.date = date;
        log.amount = amount;
        log.type = LogType.PREDICTION;

        return log;
    }

    public void assignTo(Plant plant) {
        this.plant = plant;
    }

    public LocalDate getDate() {
        return date;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public boolean isPrediction() {
        return type == LogType.PREDICTION;
    }
}
