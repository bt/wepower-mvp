package net.metasite.smartenergy.repositories;

import java.time.LocalDate;
import java.util.List;

import net.metasite.smartenergy.domain.TransactionLog;

import org.springframework.stereotype.Repository;

@Repository
public interface TransactionLogRepository extends BaseRepository<TransactionLog> {

    List<TransactionLog> findAllByFromAndDateIs(String from, LocalDate date);

    List<TransactionLog> findAllByToAndDateIs(String to, LocalDate date);

}
