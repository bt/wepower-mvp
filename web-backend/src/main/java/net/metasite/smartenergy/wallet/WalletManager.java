package net.metasite.smartenergy.wallet;

import java.util.Optional;

import net.metasite.smartenergy.domain.Consumer;
import net.metasite.smartenergy.domain.Plant;
import net.metasite.smartenergy.repositories.ConsumerRepository;
import net.metasite.smartenergy.repositories.PlantRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

@Service
public class WalletManager {

    private PlantRepository plantRepository;

    private ConsumerRepository consumerRepository;

    @Autowired
    public WalletManager(PlantRepository plantRepository, ConsumerRepository consumerRepository) {
        this.plantRepository = plantRepository;
        this.consumerRepository = consumerRepository;
    }

    @Transactional
    public Optional<WalletType> findActiveWalletType(String walletId) {
        String normalisedWalletId = walletId.toLowerCase();

        Consumer existingConsumer = consumerRepository.findByWalletIdIgnoreCaseAndActiveIsTrue(normalisedWalletId);

        if (existingConsumer != null) {
            return Optional.of(WalletType.CONSUMER);
        }

        Plant existingPlant = plantRepository.findByWalletIdIgnoreCaseAndActiveIsTrue(normalisedWalletId);

        if (existingPlant != null) {
            return Optional.of(WalletType.PLANT);
        }

        return Optional.empty();
    }

    public boolean isActive(String walletId) {
        String normalisedWalletId = walletId.toLowerCase();

        Optional<WalletType> optionalType = findActiveWalletType(normalisedWalletId);

        Assert.isTrue(optionalType.isPresent(), "Wallet is not present!");

        WalletType type = optionalType.get();

        switch (type) {
        case PLANT:
            Plant existingPlant = plantRepository.findByWalletIdIgnoreCase(normalisedWalletId);
            return existingPlant.isActive();
        case CONSUMER:
            Consumer existingConsumer = consumerRepository.findByWalletIdIgnoreCase(normalisedWalletId);
            return existingConsumer.isActive();
        }

        return false;
    }
}
