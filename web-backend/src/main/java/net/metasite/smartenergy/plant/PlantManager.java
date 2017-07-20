package net.metasite.smartenergy.plant;

import java.math.BigDecimal;
import java.time.LocalDate;

import net.metasite.smartenergy.domain.Plant;
import net.metasite.smartenergy.repositories.PlantRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.google.common.collect.Range;

@Service
public class PlantManager {

    private PlantFactory plantFactory;

    private PlantRepository plantRepository;

    @Autowired
    public PlantManager(
            PlantFactory plantFactory,
            PlantRepository plantRepository) {
        this.plantFactory = plantFactory;
        this.plantRepository = plantRepository;
    }

    @Transactional
    public Long persistPlantForm(
            String walletId,
            String name,
            Plant.Type type,
            BigDecimal capacity,
            BigDecimal latitude,
            BigDecimal longtitude,
            String areaCode,
            Range<LocalDate> activeAt) {

        Plant temporaryPlant = plantRepository.findByWalletIdIgnoreCase(walletId);

        if (temporaryPlant != null) {
            Assert.isTrue(!temporaryPlant.isActive(), "Active consumer with this wallet Id is present!");
            plantRepository.delete(temporaryPlant);
        }

        Long createdId = plantFactory.create(
                walletId,
                name,
                type,
                capacity,
                latitude,
                longtitude,
                areaCode,
                activeAt
        );

        return createdId;
    }

    @Transactional
    public void activate(String walletId) {
        Plant temporaryPlant = plantRepository.findByWalletIdIgnoreCase(walletId);

        temporaryPlant.activate();
    }

    public boolean isTaken(String walletId) {
        Plant temporaryPlant = plantRepository.findByWalletIdIgnoreCase(walletId);

        return temporaryPlant != null && temporaryPlant.isActive();
    }
}
