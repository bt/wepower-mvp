package net.metasite.smartenergy.domain;

import java.math.BigDecimal;
import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.google.common.collect.Range;

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

    protected Plant() {
    }

    public Plant(
            String walletId,
            String name,
            Type type,
            BigDecimal capacity,
            Coordinates location,
            SupportedLocationArea area,
            ActivePeriod period) {
        this.name = name;
        this.walletId = walletId;
        this.area = area;
        this.capacity = capacity;
        this.type = type;
        this.location = location;
        this.period = period;
    }

    public Long getId() {
        return id;
    }
}
