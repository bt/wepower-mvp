package net.metasite.smartenergy.domain;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(schema = "public", name = "used_ip")
public class UsedIp {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column
    private String ip;

    @Column
    private BigDecimal accCount;

    public UsedIp() {
    }

    public UsedIp(String ip) {
        this.ip = ip;
        this.accCount = BigDecimal.ONE;
    }

    public void increaseAccCount() {
        accCount = accCount.add(BigDecimal.ONE);
    }

    public Long getId() {
        return id;
    }

    public String getIp() {
        return ip;
    }

    public BigDecimal getAccCount() {
        return accCount;
    }
}
