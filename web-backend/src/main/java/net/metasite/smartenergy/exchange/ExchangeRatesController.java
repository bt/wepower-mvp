package net.metasite.smartenergy.exchange;

import java.math.BigDecimal;

import javax.annotation.Resource;

import net.metasite.smartenergy.exchange.externalapi.CryptoPricesDTO;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;


@RestController
@RequestMapping("/exchange")
public class ExchangeRatesController {

    @Resource
    private ExchangeMarketService exchangeMarketService;

    @GetMapping("price")
    public ResponseEntity<BigDecimal> getEthereumPrice() {
        return ResponseEntity.ok(exchangeMarketService.getPrice());
    }
}
