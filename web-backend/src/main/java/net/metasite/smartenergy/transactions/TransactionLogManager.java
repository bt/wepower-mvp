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
    public void log(String from, String to, LocalDate date, String transactionId, BigDecimal amount) {
        TransactionLog transactionLog = new TransactionLog(from, to, date, transactionId, amount);
        transactionLogRepository.save(transactionLog);
    }

    public List<TransactionLog> getFrom(String from, LocalDate date) {
        return transactionLogRepository.findAllByFromAndDateIs(from, date);
    }

    public List<TransactionLog> getTo(String to, LocalDate date) {
        return transactionLogRepository.findAllByToAndDateIs(to, date);
    }

}
