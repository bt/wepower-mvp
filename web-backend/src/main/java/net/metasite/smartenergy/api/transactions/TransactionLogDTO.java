package net.metasite.smartenergy.api.transactions;

import java.time.LocalDate;

public class TransactionLogDTO {

    private String from;
    private String to;
    private LocalDate date;
    private String transactionId;

    public TransactionLogDTO() {
    }

    public TransactionLogDTO(String from, String to, LocalDate date, String transactionId) {
        this.from = from;
        this.to = to;
        this.date = date;
        this.transactionId = transactionId;
    }

    public String getFrom() {
        return from;
    }

    public String getTo() {
        return to;
    }

    public LocalDate getDate() {
        return date;
    }

    public String getTransactionId() {
        return transactionId;
    }
}
