package net.metasite.smartenergy.api.ethereummarket;

import java.math.BigDecimal;

import javax.annotation.Resource;

import net.metasite.smartenergy.externalmarkets.ethereum.ExchangeMarketService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/market/ethereum")
public class ExchangeRatesController {

    @Resource
    private ExchangeMarketService exchangeMarketService;

    @GetMapping("price")
    public ResponseEntity<BigDecimal> getEthereumPrice() {
        return ResponseEntity.ok(exchangeMarketService.getPrice());
    }
}
