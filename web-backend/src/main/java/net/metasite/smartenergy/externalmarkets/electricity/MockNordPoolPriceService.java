package net.metasite.smartenergy.externalmarkets.electricity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ThreadLocalRandom;

import net.metasite.smartenergy.externalmarkets.electricity.externalapi.PriceResponseDTO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

/**
 * TODO: Remove this after nordpool logins are received, and switch to: net.metasite.smartenergy.externalmarkets.electricity.NordPoolHTTPPriceService
 *
 * Service will generate fake electricity prices.
 */
@Service
public class MockNordPoolPriceService implements ElectricityPriceLoader {

    @Async
    public CompletableFuture<PriceForDay> getPriceForDate(LocalDate date) {
        int randomPrice = ThreadLocalRandom.current().nextInt(20, 51);

        return CompletableFuture.completedFuture(new PriceForDay(date, new BigDecimal(randomPrice)));
    }
}
