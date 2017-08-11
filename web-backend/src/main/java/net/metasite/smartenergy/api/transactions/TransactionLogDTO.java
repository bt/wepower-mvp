package net.metasite.smartenergy.api.transactions;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TransactionLogDTO {

    private String plant;
    private String consumer;
    private LocalDate date;
    private String transactionId;
    private BigDecimal amountEth;
    private BigDecimal amountKwh;

    public TransactionLogDTO() {
    }

    public TransactionLogDTO(
            String plant,
            String consumer,
            LocalDate date,
            String transactionId,
            BigDecimal amountEth,
            BigDecimal amountKwh) {

        this.plant = plant;
        this.consumer = consumer;
        this.date = date;
        this.transactionId = transactionId;
        this.amountEth = amountEth;
        this.amountKwh = amountKwh;
    }

    public String getPlant() {
        return plant;
    }

    public String getConsumer() {
        return consumer;
    }

    public LocalDate getDate() {
        return date;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public BigDecimal getAmountEth() {
        return amountEth;
    }

    public BigDecimal getAmountKwh() {
        return amountKwh;
    }
}
