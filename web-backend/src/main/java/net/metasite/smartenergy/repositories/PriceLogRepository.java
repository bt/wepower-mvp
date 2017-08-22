package net.metasite.smartenergy.repositories;

import java.time.LocalDate;
import java.util.List;

import net.metasite.smartenergy.domain.Plant;
import net.metasite.smartenergy.domain.PriceLog;

import org.springframework.stereotype.Repository;

@Repository
public interface PriceLogRepository extends BaseRepository<PriceLog> {

    List<PriceLog> findAllByPlantAndDateIsBetweenOrderByDateDesc(String plant, LocalDate dateFrom, LocalDate dateTo);

    PriceLog findFirstByPlantAndDate(String plant, LocalDate date);

    PriceLog findFirstByPlantOrderByDateDesc(String plant);
}
