package net.metasite.smartenergy.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(schema = "public", name = "house_size")
public class SupportedHouseSize {

    @Id
    private Long id;

    @Column
    private String code;

    @Column
    private String description;

    public SupportedHouseSize() {
    }

    public SupportedHouseSize(Long id, String code, String description) {
        this.id = id;
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }
}
