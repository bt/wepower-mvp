package net.metasite.smartenergy.repositories;

import java.time.LocalDate;
import java.util.List;

import net.metasite.smartenergy.domain.TransactionLog;

import org.springframework.stereotype.Repository;

@Repository
public interface TransactionLogRepository extends BaseRepository<TransactionLog> {

    List<TransactionLog> findByFromAndAndDate(String from, LocalDate date);

    List<TransactionLog> findByToAndAndDate(String to, LocalDate date);

}
