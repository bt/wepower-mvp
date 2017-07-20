package net.metasite.smartenergy.api.wallet;

import java.util.Optional;

import javax.annotation.Resource;

import net.metasite.smartenergy.api.wallet.WalletDetailsDTO.ProductionType;
import net.metasite.smartenergy.domain.Plant;
import net.metasite.smartenergy.repositories.PlantRepository;
import net.metasite.smartenergy.wallet.WalletManager;
import net.metasite.smartenergy.wallet.WalletType;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static net.metasite.smartenergy.api.wallet.WalletDetailsDTO.WalletType.valueOf;

@RestController
@RequestMapping("/wallet")
public class WalletController {

    private static final Logger LOG = LoggerFactory.getLogger(WalletController.class);

    @Resource
    private WalletManager walletManager;

    @Resource
    private PlantRepository plantRepository;

    @GetMapping("{wallet}")
    public ResponseEntity<WalletDetailsDTO> getWalletDetails(
            @PathVariable(name = "wallet") String walletId) {

        Optional<WalletType> optionalType = walletManager.findActiveWalletType(walletId);

        if (!optionalType.isPresent()) {
            LOG.error("Wallet {} is not found.", walletId);
            return ResponseEntity.notFound().build();
        }

        WalletType type = optionalType.get();

        final ProductionType productionType;

        if (type == WalletType.PLANT) {
            Plant plant = plantRepository.findByWalletIdIgnoreCaseAndActiveIsTrue(walletId);
            productionType = ProductionType.valueOf(plant.getType().name());
        } else {
            productionType = null;
        }

        Boolean walletActive = walletManager.isActive(walletId);

        WalletDetailsDTO responseDetails = new WalletDetailsDTO(
                valueOf(optionalType.get().name()),
                productionType,
                walletActive
        );

        return ResponseEntity.ok(responseDetails);
    }
}
