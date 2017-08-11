package net.metasite.smartenergy.transactions;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import javax.annotation.Resource;
import javax.transaction.Transactional;

import net.metasite.smartenergy.domain.TransactionLog;
import net.metasite.smartenergy.repositories.TransactionLogRepository;

import org.springframework.stereotype.Service;

@Service
public class TransactionLogManager {

    @Resource
    private TransactionLogRepository transactionLogRepository;

    @Transactional
    public void log(
            String plant,
            String consumer,
            LocalDate date,
            String transactionId,
            BigDecimal amountEth,
            BigDecimal amountKwh) {

        TransactionLog transactionLog = new TransactionLog(plant, consumer, date, transactionId, amountEth, amountKwh);
        transactionLogRepository.save(transactionLog);
    }

    public List<TransactionLog> getForPlant(String plant, LocalDate date) {
        return transactionLogRepository.findAllByPlantAndDate(plant, date);
    }

    public List<TransactionLog> getForConsumer(String consumer, LocalDate date) {
        return transactionLogRepository.findAllByConsumerAndDate(consumer, date);
    }

}
