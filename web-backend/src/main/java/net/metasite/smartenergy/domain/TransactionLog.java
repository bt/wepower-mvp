package net.metasite.smartenergy.domain;

import java.math.BigDecimal;
import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(schema = "public", name = "transaction_log")
public class TransactionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column
    private String plant;

    @Column
    private String consumer;

    @Column
    private LocalDate date;

    @Column
    private String transaction;

    @Column
    private BigDecimal amountEth;

    @Column
    private BigDecimal amountKwh;

    public TransactionLog() {
    }

    public TransactionLog(
            String plant,
            String consumer,
            LocalDate date,
            String transaction,
            BigDecimal amountEth,
            BigDecimal amountKwh) {

        this.plant = plant;
        this.consumer = consumer;
        this.date = date;
        this.transaction = transaction;
        this.amountEth = amountEth;
        this.amountKwh = amountKwh;
    }

    public String getPlant() {
        return plant;
    }

    public void setPlant(String plant) {
        this.plant = plant;
    }

    public String getConsumer() {
        return consumer;
    }

    public void setConsumer(String consumer) {
        this.consumer = consumer;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getTransaction() {
        return transaction;
    }

    public void setTransaction(String transaction) {
        this.transaction = transaction;
    }

    public BigDecimal getAmountEth() {
        return amountEth;
    }

    public void setAmountEth(BigDecimal amountEth) {
        this.amountEth = amountEth;
    }

    public BigDecimal getAmountKwh() {
        return amountKwh;
    }

    public void setAmountKwh(BigDecimal amountKwh) {
        this.amountKwh = amountKwh;
    }
}
