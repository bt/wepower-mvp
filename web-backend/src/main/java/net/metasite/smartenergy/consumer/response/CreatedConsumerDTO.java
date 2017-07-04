package net.metasite.smartenergy.consumer.response;

public class CreatedConsumerDTO {
    private Long consumerId;

    public CreatedConsumerDTO(Long consumerId) {
        this.consumerId = consumerId;
    }

    public Long getConsumerId() {
        return consumerId;
    }
}
