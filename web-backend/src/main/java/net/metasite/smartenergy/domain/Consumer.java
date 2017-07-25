package net.metasite.smartenergy.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.Iterables;
import com.google.common.collect.Range;

import static net.metasite.smartenergy.domain.ProductionLog.buildProduction;

@Entity
@Table(schema = "public", name = "consumer")
public class Consumer {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column
    private String walletId;

    @ManyToOne
    @JoinColumn(name = "area_id")
    private SupportedLocationArea area;

    @ManyToOne
    @JoinColumn(name = "size_id")
    private SupportedHouseSize size;

    @Column
    private String meterId;

    @Column
    private BigDecimal consumption;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true, mappedBy = "consumer")
    private List<ConsumptionLog> consumptionlogs = new ArrayList<>();

    @Column
    private boolean active;

    private Consumer() {

    }

    public Consumer(
            String walletId,
            String meterId,
            BigDecimal consumption,
            SupportedLocationArea at,
            SupportedHouseSize size,
            boolean active) {
        this.walletId = walletId;
        this.area = at;
        this.size = size;
        this.meterId = meterId;
        this.consumption = consumption;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public String getWalletId() {
        return walletId;
    }

    public boolean isActive() {
        return active;
    }

    public List<ConsumptionLog> consumptionPredictionsForPeriod(Range<LocalDate> period) {
        return consumptionlogs.stream()
                .filter(consumptionLog -> consumptionLog.isPrediction())
                .filter(consumptionLog -> period.contains(consumptionLog.getDate()))
                .collect(Collectors.toList());
    }

    public void assignLogs(List<ConsumptionLog> logs) {
        consumptionlogs.addAll(logs);
        for (ConsumptionLog log : logs) {
            log.assignTo(this);
        }
    }

    public BigDecimal totalConsumptionPredictionForPeriod(Range<LocalDate> period) {
        return consumptionPredictionsForPeriod(period).stream()
                .map(consumptionLog -> consumptionLog.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public List<ConsumptionLog> consumptionForPeriod(Range<LocalDate> period) {
        if (!Range.atMost(LocalDate.now()).isConnected(period)) {
            return ImmutableList.of();
        }

        Range<LocalDate> seletedPastPeriod = Range.atMost(LocalDate.now()).intersection(period);

        return consumptionlogs.stream()
                .filter(productionLog -> productionLog.isConsumption())
                .filter(productionLog -> seletedPastPeriod.contains(productionLog.getDate()))
                .collect(Collectors.toList());
    }

    public void mockConsumption(Range<LocalDate> period) {
        float variation = 0.1f;

        List<ConsumptionLog> consumption = new ArrayList<>();

        for (LocalDate predictionDay = period.lowerEndpoint();
             period.contains(predictionDay);
             predictionDay = predictionDay.plusDays(1)) {

            Optional<BigDecimal> predictedConsumption = predictionForDay(predictionDay);
            if (!predictedConsumption.isPresent()) {
                continue;
            }

            BigDecimal predictionForDay = predictedConsumption.get();
            int absoluteVariation = predictionForDay.multiply(new BigDecimal(variation)).intValue();
            int randomDeviation = ThreadLocalRandom.current().nextInt(absoluteVariation);

            BigDecimal productionPrediction = predictionForDay.subtract(new BigDecimal(randomDeviation));

            consumption.add(ConsumptionLog.buildConsumption(predictionDay, productionPrediction));
        }

        consumptionlogs.addAll(consumption);
        consumption.forEach(consumptionLog -> consumptionLog.assignTo(this));
    }

    private Optional<BigDecimal> predictionForDay(LocalDate day) {
        return consumptionlogs.stream()
                .filter(consumptionLog -> consumptionLog.getDate().isEqual(day))
                .findAny()
                .map(ConsumptionLog::getAmount);
    }

    public void activate() {
        this.active = true;
    }

    public Range<LocalDate> predictedRange() {
        List<ConsumptionLog> sortedPredictions = consumptionlogs.stream()
                .filter(consumptionLog -> consumptionLog.isPrediction())
                .sorted((o1, o2) -> o1.getDate().isAfter(o2.getDate()) ? 1 : -1)
                .collect(Collectors.toList());

        ConsumptionLog firtPrediction = Iterables.getFirst(sortedPredictions, null);
        ConsumptionLog lastPrediction = Iterables.getLast(sortedPredictions);

        return Range.closed(firtPrediction.getDate(), lastPrediction.getDate());
    }
}
