package net.metasite.smartenergy.domain;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

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
}
