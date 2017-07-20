package net.metasite.smartenergy.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.Range;

import static net.metasite.smartenergy.domain.ProductionLog.buildProduction;

@Entity
@Table(schema = "public", name = "plant")
public class Plant {

    public enum Type {
        SOLAR, WIND, HYDRO
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column
    private String name;

    @Column
    private String walletId;

    @ManyToOne
    @JoinColumn(name = "area_id")
    private SupportedLocationArea area;

    @Column
    private BigDecimal capacity;

    @Column
    @Enumerated(EnumType.STRING)
    private Type type;

    @Embedded
    private Coordinates location;

    @Embedded
    private ActivePeriod period;

    @Column
    private boolean active;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true, mappedBy = "plant")
    private List<ProductionLog> productionLogs = new ArrayList<>();

    protected Plant() {
    }

    public Plant(
            String walletId,
            String name,
            Type type,
            BigDecimal capacity,
            Coordinates location,
            SupportedLocationArea area,
            ActivePeriod period,
            boolean active) {
        this.name = name;
        this.walletId = walletId;
        this.area = area;
        this.capacity = capacity;
        this.type = type;
        this.location = location;
        this.period = period;
        this.active = active;
    }

    public boolean isActive() {
        return active;
    }

    public String getWalletId() {
        return walletId;
    }

    public Type getType() {
        return type;
    }

    public void activate() {
        this.active = true;
    }

    public void assignLogs(List<ProductionLog> usageLogs) {
        this.productionLogs.addAll(usageLogs);
        usageLogs.forEach(productionLog -> productionLog.assignTo(this));
    }

    public Long getId() {
        return id;
    }

    public List<ProductionLog> productionPredictionsForPeriod(Range<LocalDate> period) {
        return productionLogs.stream()
                .filter(productionLog -> productionLog.isPrediction())
                .filter(productionLog -> period.contains(productionLog.getDate()))
                .collect(Collectors.toList());
    }

    public BigDecimal totalProductionPredictionForPeriod(Range<LocalDate> period) {
        return productionPredictionsForPeriod(period)
                .stream()
                .map(productionLog -> productionLog.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public List<ProductionLog> productionForPeriod(Range<LocalDate> period) {
        if (!Range.atMost(LocalDate.now()).isConnected(period)) {
            return ImmutableList.of();
        }

        Range<LocalDate> seletedPastPeriod = Range.atMost(LocalDate.now()).intersection(period);

        return productionLogs.stream()
                .filter(productionLog -> productionLog.isProduction())
                .filter(productionLog -> seletedPastPeriod.contains(productionLog.getDate()))
                .collect(Collectors.toList());
    }

    private Optional<BigDecimal> predictionForDay(LocalDate day) {
        return productionLogs.stream()
                .filter(productionLog -> productionLog.getDate().isEqual(day))
                .findAny()
                .map(ProductionLog::getAmount);
    }


    public void mockProduction(Range<LocalDate> period) {
        float variation = 0.1f;

        List<ProductionLog> production = new ArrayList<>();

        for (LocalDate predictionDay = period.lowerEndpoint();
             period.contains(predictionDay);
             predictionDay = predictionDay.plusDays(1)) {

            Optional<BigDecimal> predictedProduction = predictionForDay(predictionDay);

            if (!predictedProduction.isPresent()) {
                continue;
            }

            BigDecimal predictionForDay = predictedProduction.get();

            int absoluteVariation = predictionForDay.multiply(new BigDecimal(variation)).intValue();
            int randomDeviation = ThreadLocalRandom.current().nextInt(absoluteVariation);

            BigDecimal productionPrediction = predictionForDay.add(new BigDecimal(randomDeviation));

            production.add(buildProduction(predictionDay, productionPrediction));
        }

        productionLogs.addAll(production);
        production.forEach(productionLog -> productionLog.assignTo(this));
    }
}
