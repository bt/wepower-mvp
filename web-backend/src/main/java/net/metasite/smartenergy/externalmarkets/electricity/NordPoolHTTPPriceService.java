package net.metasite.smartenergy.externalmarkets.electricity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import net.metasite.smartenergy.domain.ElectricityDailyPrice;
import net.metasite.smartenergy.externalmarkets.electricity.externalapi.PriceResponseDTO;
import net.metasite.smartenergy.repositories.ElectricityDailyPriceRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
public class NordPoolHTTPPriceService {

    private static final Logger LOG = LoggerFactory.getLogger(NordPoolHTTPPriceService.class);

    @Value("${electricity-market.nordpool.api-get-system-price}}")
    private String systemPriceUrl;

    private NordPoolAuthenthicationProvider nordPoolAuthenthicationProvider;

    @Autowired
    public NordPoolHTTPPriceService(NordPoolAuthenthicationProvider nordPoolAuthenthicationProvider) {
        this.nordPoolAuthenthicationProvider = nordPoolAuthenthicationProvider;
    }

    @Async
    public CompletableFuture<PriceForDay> getPriceForDate(LocalDate date) {
        String token = nordPoolAuthenthicationProvider.getAndUpdateToken();

        String url = String.format(systemPriceUrl, "EUR", date.format(DateTimeFormatter.ISO_LOCAL_DATE));

        PriceResponseDTO responseBody;
        try {
            ResponseEntity<PriceResponseDTO> response = new RestTemplate()
                    .getForEntity(url, PriceResponseDTO.class);

            if (!response.getStatusCode().is2xxSuccessful()) {
                return CompletableFuture.completedFuture(new PriceForDay(date, BigDecimal.ONE));
            }

            responseBody = response.getBody();
        } catch (HttpClientErrorException e) {
            LOG.error("Failed price request: " + e.getResponseBodyAsString());
            return CompletableFuture.completedFuture(new PriceForDay(date, BigDecimal.ONE));
        }

        // TODO: Refactor to use big decimals fully, in order not to loose precision.
        Double priceForDay = responseBody.getPublicationTimeSeries()
                .getPeriod()
                .getInterval()
                .stream()
                .map(interval -> interval.getPrice())
                .mapToDouble(BigDecimal::doubleValue)
                .average()
                .getAsDouble();

        return CompletableFuture.completedFuture(new PriceForDay(date, new BigDecimal(priceForDay)));
    }

    public static class PriceForDay {
        private LocalDate day;
        private BigDecimal price;

        public PriceForDay(LocalDate day, BigDecimal price) {
            this.day = day;
            this.price = price;
        }

        public LocalDate getDay() {
            return day;
        }

        public BigDecimal getPrice() {
            return price;
        }
    }
}
