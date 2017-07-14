package net.metasite.smartenergy.externalmarkets.electricity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.function.BiConsumer;
import java.util.stream.Collectors;

import net.metasite.smartenergy.domain.ElectricityDailyPrice;
import net.metasite.smartenergy.externalmarkets.electricity.NordPoolHTTPPriceService.PriceForDay;
import net.metasite.smartenergy.repositories.ElectricityDailyPriceRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableMap.Builder;
import com.google.common.collect.Range;

@Service
public class ElectricityPricesManager {

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

        Map<LocalDate, CompletableFuture<PriceForDay>> promises = new HashMap<>();

        for (LocalDate date = period.lowerEndpoint(); period.contains(date); date = date.plusDays(1)) {
            if (cachedDates.contains(date)) {
                continue;
            }

            CompletableFuture<PriceForDay> dailyPricePromise = nordPoolHTTPPriceService.getPriceForDate(date);
            promises.put(date, dailyPricePromise);
        }

        Builder resultBuilder = ImmutableMap.builder();

        alreadyChachedDailyPrices.forEach(dailyPrice ->
                resultBuilder.put(dailyPrice.getDate(), dailyPrice.getUnitPrice())
        );

        promises.forEach(completePromises(resultBuilder));

        return resultBuilder.build();
    }

    private BiConsumer<LocalDate, CompletableFuture<PriceForDay>> completePromises(Builder resultBuilder) {
        return (key, value) -> {
            value.exceptionally(throwable -> new PriceForDay(key, BigDecimal.ZERO))
                    .thenAccept(priceForDay -> resultBuilder.put(priceForDay.getDay(), priceForDay.getPrice()));
        };
    }
}
