package net.metasite.smartenergy.repositories;

import java.time.LocalDate;
import java.util.List;

import net.metasite.smartenergy.domain.ElectricityDailyPrice;
import net.metasite.smartenergy.domain.Plant;

import org.springframework.stereotype.Repository;

@Repository
public interface ElectricityDailyPriceRepository extends BaseRepository<ElectricityDailyPrice> {

    List<ElectricityDailyPrice> findAllByDateIsBetween(LocalDate from, LocalDate to);

}
