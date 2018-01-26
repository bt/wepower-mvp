package net.metasite.smartenergy.repositories;

import net.metasite.smartenergy.domain.UsedIp;

import org.springframework.stereotype.Repository;

@Repository
public interface UsedIpRepository extends BaseRepository<UsedIp>  {

    UsedIp findByIp(String ip);

}
