package net.metasite.smartenergy.externalmarkets.ethereum;

import java.math.BigDecimal;

import net.metasite.smartenergy.externalmarkets.electricity.ElectricityPricesManager;
import net.metasite.smartenergy.externalmarkets.ethereum.externalapi.CryptoPricesDTO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ExchangeMarketService {

    private static final Logger LOG = LoggerFactory.getLogger(ExchangeMarketService.class);

    @Value("${exchange-market.eth-price}")
    private String ethPriceServiceUrl;

    public BigDecimal getPrice() {
        try {
            ResponseEntity<CryptoPricesDTO[]> priceResponse = new RestTemplate()
                    .getForEntity(ethPriceServiceUrl, CryptoPricesDTO[].class);

            if (priceResponse.getStatusCode() != HttpStatus.OK) {
                // TODO: Handle failure
                return BigDecimal.ZERO;
            }

            CryptoPricesDTO[] prices = priceResponse.getBody();
            if (prices.length == 0) {
                return BigDecimal.ONE;
            }

            return prices[0].getPriceEur();
        } catch (Exception e) {
            LOG.error("Error while getting etherium prices, cause " + e.getMessage(), e);
            return BigDecimal.ZERO;
        }
    }
}
