package net.metasite.smartenergy.externalmarkets.ethereum;

import java.math.BigDecimal;

import net.metasite.smartenergy.externalmarkets.ethereum.externalapi.CryptoPricesDTO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ExchangeMarketService {

    @Value("${exchange-market.eth-price}")
    private String ethPriceServiceUrl;

    public BigDecimal getPrice() {
        ResponseEntity<CryptoPricesDTO> priceResponse = new RestTemplate()
                .getForEntity(ethPriceServiceUrl, CryptoPricesDTO.class);

        if (priceResponse.getStatusCode() != HttpStatus.OK) {
            // TODO: Handle failure
            return BigDecimal.ZERO;
        }

        return priceResponse.getBody().getEur();
    }
}
