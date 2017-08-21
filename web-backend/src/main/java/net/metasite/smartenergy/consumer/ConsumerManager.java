package net.metasite.smartenergy.consumer;

import java.math.BigDecimal;
import java.time.LocalDate;

import net.metasite.smartenergy.domain.Consumer;
import net.metasite.smartenergy.repositories.ConsumerRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import static java.time.LocalDate.now;

@Service
public class ConsumerManager {

    private ConsumerFactory consumerFactory;

    private ConsumerRepository consumerRepository;

    @Autowired
    public ConsumerManager(
            ConsumerFactory consumerFactory,
            ConsumerRepository consumerRepository) {
        this.consumerFactory = consumerFactory;
        this.consumerRepository = consumerRepository;
    }

    @Transactional
    public Long persistConsumerForm(
            String walletId,
            String areaCode,
            String meterId,
            BigDecimal consumption,
            String houseSizeCode,
            LocalDate consumeFrom,
            LocalDate consumeTo) {

        Consumer temporaryConsumer = consumerRepository.findByWalletIdIgnoreCase(walletId);

        if (temporaryConsumer != null) {
            Assert.isTrue(!temporaryConsumer.isActive(), "Active consumer with this wallet Id is present!");
            consumerRepository.delete(temporaryConsumer);
        }

        Long createdId = consumerFactory.create(
                walletId,
                areaCode,
                meterId,
                consumption,
                houseSizeCode,
                consumeFrom,
                consumeTo
        );

        return createdId;
    }

    @Transactional
    public void activate(String walletId) {
        Consumer temporaryConsumer = consumerRepository.findByWalletIdIgnoreCase(walletId);

        temporaryConsumer.activate();
    }

    public boolean isTaken(String walletId) {
        Consumer temporaryConsumer = consumerRepository.findByWalletIdIgnoreCase(walletId);

        return temporaryConsumer != null && temporaryConsumer.isActive();
    }
}
