package net.metasite.smartenergy.repositories;

import net.metasite.smartenergy.domain.Consumer;

import org.springframework.stereotype.Repository;

@Repository
public interface ConsumerRepository extends BaseRepository<Consumer> {

    Consumer findByWalletIdIgnoreCase(String walletId);

    Consumer findByWalletIdIgnoreCaseAndActiveIsTrue(String walletId);

}
