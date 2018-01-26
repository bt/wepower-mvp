package net.metasite.smartenergy.usedip;

import java.math.BigDecimal;

import javax.annotation.Resource;
import javax.transaction.Transactional;

import net.metasite.smartenergy.domain.UsedIp;
import net.metasite.smartenergy.repositories.UsedIpRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class UsedIpManager {

    @Value("${max-acc-for-ip}")
    BigDecimal maxAccForIp;

    @Resource
    private UsedIpRepository repository;

    public boolean isAllowed(String ip) {
        UsedIp usedIp = repository.findByIp(ip);
        return usedIp == null || usedIp.getAccCount().compareTo(maxAccForIp) == -1;
    }

    @Transactional
    public void addAcc(String ip) {
        UsedIp usedIp = repository.findByIp(ip);
        if (usedIp != null) {
            usedIp.increaseAccCount();
        } else {
            usedIp = new UsedIp(ip);
        }
        repository.save(usedIp);
    }

}
