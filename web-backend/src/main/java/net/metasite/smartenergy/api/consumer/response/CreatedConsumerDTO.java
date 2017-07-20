package net.metasite.smartenergy.api.consumer.response;

public class CreatedConsumerDTO {
    private Long consumerId;

    public CreatedConsumerDTO(Long consumerId) {
        this.consumerId = consumerId;
    }

    public Long getConsumerId() {
        return consumerId;
    }
}
