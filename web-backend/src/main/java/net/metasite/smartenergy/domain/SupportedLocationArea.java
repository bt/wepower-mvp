package net.metasite.smartenergy.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity
@Table(schema = "public", name = "location_area")
public class SupportedLocationArea {

    @Id
    private Long id;

    @Column
    private String code;

    @Column
    private String description;

    public SupportedLocationArea() {
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }
}
