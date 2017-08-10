package net.metasite.smartenergy.repositories;

import java.time.LocalDate;
import java.util.List;

import net.metasite.smartenergy.domain.Plant;
import net.metasite.smartenergy.domain.PriceLog;

import org.springframework.stereotype.Repository;

@Repository
public interface PriceLogRepository extends BaseRepository<PriceLog> {

    List<PriceLog> findAllByPlantAndDateIsAfterAndDateIsBeforeOrderByDateDesc(String plant, LocalDate dateFrom, LocalDate dateTo);

    List<PriceLog> findAllByPlantAndDateIs(String plant, LocalDate date);
}
