package net.metasite.smartenergy.externalmarkets.electricity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import javax.annotation.Resource;

import net.metasite.smartenergy.domain.NordPoolToken;
import net.metasite.smartenergy.externalmarkets.electricity.externalapi.TokenRequestDTO;
import net.metasite.smartenergy.externalmarkets.electricity.externalapi.TokenResponseDTO;
import net.metasite.smartenergy.repositories.NordPoolTokenRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.web.client.RestTemplate;

import static java.time.LocalDateTime.now;
import static java.util.Arrays.asList;

@Service
public class NordPoolHTTPTokenServiceWrapper {

    @Value("${electricity-market.nordpool.api-user}")
    private String apiUsername;

    @Value("${electricity-market.nordpool.api-password}")
    private String apiPassword;

    @Value("${electricity-market.nordpool.api-get-token-url}")
    private String getTokenUrl;

    public TokenResponseDTO getToken() {
        LocalDateTime requestIssuedAt = LocalDateTime.now();

        HttpHeaders headers = new HttpHeaders();
        headers.put("Authorization", asList("Basic", "Y2xpZW50X2RheWFoZWFkX2FwaTpjbGllbnRfZGF5YWhlYWRfYXBp"));
        headers.setAccept(asList(MediaType.APPLICATION_JSON));

        TokenRequestDTO requestBody = new TokenRequestDTO("password", "dayahead_api", apiUsername, apiPassword);
        HttpEntity<TokenRequestDTO> entity = new HttpEntity<TokenRequestDTO>(requestBody, headers);

        ResponseEntity<TokenResponseDTO> response = new RestTemplate().postForEntity(getTokenUrl, entity, TokenResponseDTO.class);

        Assert.isTrue(response.getStatusCode().is2xxSuccessful(), "Token request failed");

        return response.getBody();
    }
}
