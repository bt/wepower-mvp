package net.metasite.smartenergy.prices;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import net.metasite.smartenergy.domain.PriceLog;
import net.metasite.smartenergy.repositories.PlantRepository;
import net.metasite.smartenergy.repositories.PriceLogRepository;

import org.springframework.stereotype.Service;

@Service
public class PriceLogManager {

    @Resource
    private PriceLogRepository priceLogRepository;

    @Resource
    private PlantRepository plantRepository;

    public void log(String plant, BigDecimal price, LocalDate date) {
        PriceLog log = new PriceLog(plant, date, price);
        priceLogRepository.save(log);
    }

    public Map<LocalDate, BigDecimal> getFromTo(String plant, LocalDate from, LocalDate to) {

        List<PriceLog> priceLogs =
                priceLogRepository.findAllByPlantAndDateIsAfterAndDateIsBeforeOrderByDateDesc(plant, from, to);

        Map<LocalDate, List<PriceLog>> logs = priceLogs.stream()
                .collect(Collectors.groupingBy(PriceLog::getDate));

        Map<LocalDate, BigDecimal> prices = new HashMap<>();
        LocalDate currentDate = from;
        BigDecimal lastPrice = BigDecimal.ZERO;

        for (Map.Entry<LocalDate, List<PriceLog>> log: logs.entrySet()) {
            final BigDecimal price = getAvaragePrice(log.getValue());
            final LocalDate date = log.getKey();

            while (currentDate.isBefore(date) || currentDate.isEqual(date)) {
                prices.put(currentDate, price);
                currentDate = currentDate.plusDays(1);
            }
            currentDate = date.plusDays(1);
            lastPrice = price;
        }

        while (currentDate.isBefore(to) || currentDate.isEqual(to)) {
            prices.put(currentDate, lastPrice);
            currentDate = currentDate.plusDays(1);
        }

        return prices;

    }

    public BigDecimal getFor(String plant, LocalDate date) {
        List<PriceLog> prices = priceLogRepository.findAllByPlantAndDate(plant, date);

        if (!prices.isEmpty()) {
            return getAvaragePrice(prices);
        }

        PriceLog priceLog = priceLogRepository.findFirstByPlantOrderByDateDesc(plant);
        return priceLog == null ? BigDecimal.ZERO : priceLog.getPrice();
    }

    private BigDecimal getAvaragePrice(List<PriceLog> priceLogs) {
        return BigDecimal.valueOf(priceLogs.stream()
                .map(PriceLog::getPrice)
                .collect(Collectors.averagingDouble(BigDecimal::doubleValue)));
    }


}
