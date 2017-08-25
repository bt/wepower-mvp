package net.metasite.smartenergy.prices;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import net.metasite.smartenergy.domain.PriceLog;
import net.metasite.smartenergy.repositories.PlantRepository;
import net.metasite.smartenergy.repositories.PriceLogRepository;

import org.springframework.stereotype.Service;

import static java.util.stream.Collectors.toMap;

@Service
public class PriceLogManager {

    @Resource
    private PriceLogRepository priceLogRepository;

    public void log(String plant, BigDecimal price, LocalDate date) {

        PriceLog priceLog = priceLogRepository.findFirstByPlantAndDate(plant, date);
        if (priceLog == null) {
            priceLogRepository.save(new PriceLog(plant, date, price));
            return;
        }

        priceLog.setPrice(price);
        priceLogRepository.save(priceLog);
    }

    public Map<LocalDate, BigDecimal> getFromTo(String plant, LocalDate from, LocalDate to) {
        List<PriceLog> priceLogs = priceLogRepository.findAllByPlantAndDateIsBetweenOrderByDateAsc(plant, from, to);

        Map<LocalDate, BigDecimal> prices = priceLogs
                .stream()
                .collect(toMap(PriceLog::getDate, PriceLog::getPrice));

        prependToDate(from, priceLogs.stream().findFirst(), prices);
        appendToDate(to, priceLogs.stream().reduce((a, b) -> b), prices);

        return prices.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue,
                        (oldValue, newValue) -> oldValue, LinkedHashMap::new));
    }

    public void prependToDate(LocalDate from, Optional<PriceLog> priceLog, Map<LocalDate, BigDecimal> prices) {
        if (!priceLog.isPresent()) {
            return;
        }

        final LocalDate toDate = priceLog.get().getDate();
        final BigDecimal price = priceLog.get().getPrice();

        LocalDate currentDate = from;
        while (currentDate.isBefore(toDate) || currentDate.isEqual(toDate)) {
            prices.put(currentDate, price);
            currentDate = currentDate.plusDays(1);
        }
    }

    public void appendToDate(LocalDate to, Optional<PriceLog> priceLog, Map<LocalDate, BigDecimal> prices) {
        if (!priceLog.isPresent()) {
            return;
        }

        LocalDate currentDate = priceLog.get().getDate();
        final BigDecimal price = priceLog.get().getPrice();

        while (currentDate.isBefore(to) || currentDate.isEqual(to)) {
            prices.put(currentDate, price);
            currentDate = currentDate.plusDays(1);
        }
    }

    public BigDecimal getFor(String plant, LocalDate date) {
        PriceLog priceLog = priceLogRepository.findFirstByPlantAndDate(plant, date);

        if (priceLog != null) {
            return priceLog.getPrice();
        }

        priceLog = priceLogRepository.findFirstByPlantOrderByDateDesc(plant);
        return priceLog == null ? BigDecimal.ZERO : priceLog.getPrice();
    }

}
