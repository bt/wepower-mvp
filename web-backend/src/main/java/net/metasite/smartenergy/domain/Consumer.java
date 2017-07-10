package net.metasite.smartenergy.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
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

import com.google.common.collect.Range;

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

    private Consumer() {

    }

    public Consumer(
            String walletId,
            String meterId,
            BigDecimal consumption,
            SupportedLocationArea at,
            SupportedHouseSize size) {
        this.walletId = walletId;
        this.area = at;
        this.size = size;
        this.meterId = meterId;
        this.consumption = consumption;
    }

    public Long getId() {
        return id;
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
}
