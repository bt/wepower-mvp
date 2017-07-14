package net.metasite.smartenergy.externalmarkets.electricity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import javax.annotation.Resource;

import net.metasite.smartenergy.domain.NordPoolToken;
import net.metasite.smartenergy.externalmarkets.electricity.externalapi.TokenRequestDTO;
import net.metasite.smartenergy.externalmarkets.electricity.externalapi.TokenResponseDTO;
import net.metasite.smartenergy.repositories.NordPoolTokenRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.web.client.RestTemplate;

import static java.time.LocalDateTime.now;
import static java.util.Arrays.asList;
import static org.springframework.beans.factory.config.BeanDefinition.SCOPE_SINGLETON;

@Service
public class NordPoolAuthenthicationProvider {

    private NordPoolTokenRepository nordPoolTokenRepository;

    private NordPoolHTTPTokenServiceWrapper nordPoolHTTPTokenServiceWrapper;

    @Autowired
    public NordPoolAuthenthicationProvider(
            NordPoolTokenRepository nordPoolTokenRepository,
            NordPoolHTTPTokenServiceWrapper nordPoolHTTPTokenServiceWrapper) {
        this.nordPoolTokenRepository = nordPoolTokenRepository;
        this.nordPoolHTTPTokenServiceWrapper = nordPoolHTTPTokenServiceWrapper;
    }

    @Transactional
    public String getAndUpdateToken() {
        NordPoolToken token = nordPoolTokenRepository.findByExpiresAtAfter(now());

        if (token != null) {
            return token.getToken();
        }

        LocalDateTime requestIssuedAt = LocalDateTime.now();

        TokenResponseDTO receivedToken = nordPoolHTTPTokenServiceWrapper.getToken();

        LocalDateTime expirationTime = requestIssuedAt.plusSeconds(receivedToken.getExpiresIn());
        NordPoolToken accessToken = new NordPoolToken(receivedToken.getAccessToken(), expirationTime);

        nordPoolTokenRepository.save(accessToken);

        return accessToken.getToken();
    }
}
