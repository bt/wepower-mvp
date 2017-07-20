package net.metasite.smartenergy.repositories;

import net.metasite.smartenergy.domain.Consumer;
import net.metasite.smartenergy.domain.Plant;
import net.metasite.smartenergy.domain.SupportedHouseSize;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ConsumerRepository extends BaseRepository<Consumer> {

    Consumer findByWalletIdIgnoreCase(String walletId);

    Consumer findByWalletIdIgnoreCaseAndActiveIsTrue(String walletId);

}
