package net.metasite.smartenergy.repositories;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import net.metasite.smartenergy.domain.ElectricityDailyPrice;
import net.metasite.smartenergy.domain.NordPoolToken;

import org.springframework.stereotype.Repository;

@Repository
public interface NordPoolTokenRepository extends BaseRepository<NordPoolToken> {
    NordPoolToken findByExpiresAtAfter(LocalDateTime now);
}
