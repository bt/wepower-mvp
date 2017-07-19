package net.metasite.smartenergy.externalmarkets.electricity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import net.metasite.smartenergy.domain.ElectricityDailyPrice;
import net.metasite.smartenergy.externalmarkets.electricity.NordPoolHTTPPriceService.PriceForDay;
import net.metasite.smartenergy.repositories.ElectricityDailyPriceRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableMap.Builder;
import com.google.common.collect.Range;

@Service
public class ElectricityPricesManager {

    private static final Logger LOG = LoggerFactory.getLogger(ElectricityPricesManager.class);

    private ElectricityDailyPriceRepository electricityDailyPriceRepository;

    private NordPoolHTTPPriceService nordPoolHTTPPriceService;

    @Autowired
    public ElectricityPricesManager(
            ElectricityDailyPriceRepository electricityDailyPriceRepository,
            NordPoolHTTPPriceService nordPoolHTTPPriceService) {
        this.electricityDailyPriceRepository = electricityDailyPriceRepository;
        this.nordPoolHTTPPriceService = nordPoolHTTPPriceService;
    }

    public ImmutableMap<LocalDate, BigDecimal> getPricesForPeriod(Range<LocalDate> period) {
        List<ElectricityDailyPrice> alreadyChachedDailyPrices =
                electricityDailyPriceRepository.findAllByDateIsBetween(
                        period.lowerEndpoint(), period.upperEndpoint());

        List<LocalDate> cachedDates = alreadyChachedDailyPrices.stream()
                .map(electricityDailyPrice -> electricityDailyPrice.getDate())
                .collect(Collectors.toList());

        List<LocalDate> missingDates = new ArrayList<>();
        for (LocalDate date = period.lowerEndpoint(); period.contains(date); date = date.plusDays(1)) {
            if (cachedDates.contains(date)) {
                continue;
            }

            missingDates.add(date);
        }

        List<PriceForDay> receivedPrices = fetchRemainingFromNordPool(missingDates);

        cacheMissingPrices(receivedPrices);

        Builder resultBuilder = ImmutableMap.builder();

        alreadyChachedDailyPrices.forEach(dailyPrice -> resultBuilder.put(dailyPrice.getDate(), dailyPrice.getUnitPrice()));
        receivedPrices.forEach(priceForDay -> resultBuilder.put(priceForDay.getDay(), priceForDay.getPrice()));

        return resultBuilder.build();
    }

    private void cacheMissingPrices(List<PriceForDay> receivedPrices) {
        List<ElectricityDailyPrice> validPricesReceived = receivedPrices.stream()
                .filter(price -> !price.getPrice().equals(BigDecimal.ZERO))
                .map(priceForDay -> new ElectricityDailyPrice(priceForDay.getDay(), priceForDay.getPrice()))
                .collect(Collectors.toList());

        electricityDailyPriceRepository.save(validPricesReceived);
    }

    private List<PriceForDay> fetchRemainingFromNordPool(List<LocalDate> requiredDates) {
        Map<LocalDate, CompletableFuture<PriceForDay>> promises = new HashMap<>();

        requiredDates.forEach(date -> promises.put(date, nordPoolHTTPPriceService.getPriceForDate(date)));


        return promises.entrySet()
                .stream()
                .map(pricePromise -> {
                    try {
                        return pricePromise.getValue().get();
                    } catch (InterruptedException | ExecutionException e) {
                        LOG.error("Failed to get price for: " + pricePromise.getKey());
                        return new PriceForDay(pricePromise.getKey(), BigDecimal.ZERO);
                    }
                })
                .collect(Collectors.toList());
    }
}
