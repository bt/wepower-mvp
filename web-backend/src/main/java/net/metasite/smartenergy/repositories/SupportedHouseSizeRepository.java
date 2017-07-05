package net.metasite.smartenergy.repositories;

import net.metasite.smartenergy.domain.SupportedHouseSize;

import org.springframework.stereotype.Repository;

@Repository
public interface SupportedHouseSizeRepository extends BaseRepository<SupportedHouseSize> {

    SupportedHouseSize findByCode(String code);

}
