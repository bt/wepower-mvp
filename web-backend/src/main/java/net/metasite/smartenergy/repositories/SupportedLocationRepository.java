package net.metasite.smartenergy.repositories;

import net.metasite.smartenergy.domain.SupportedLocationArea;

import org.springframework.stereotype.Repository;

@Repository
public interface SupportedLocationRepository extends BaseRepository<SupportedLocationArea> {

    SupportedLocationArea findByCode(String code);
}
