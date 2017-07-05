package net.metasite.smartenergy.domain;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.Table;

@Embeddable
public class Coordinates {

    @Column
    private BigDecimal latitude;

    @Column
    private BigDecimal longtitude;

    protected Coordinates() {
    }

    private Coordinates(BigDecimal latitude, BigDecimal longtitude) {
        this.latitude = latitude;
        this.longtitude = longtitude;
    }

    public static Coordinates at(BigDecimal latitude, BigDecimal longtitude) {
        return new Coordinates(latitude, longtitude);
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public BigDecimal getLongtitude() {
        return longtitude;
    }
}
