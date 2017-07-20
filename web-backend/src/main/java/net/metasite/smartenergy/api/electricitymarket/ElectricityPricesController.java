package net.metasite.smartenergy.api.electricitymarket;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import net.metasite.smartenergy.api.electricitymarket.response.DailyElectricityPriceDTO;
import net.metasite.smartenergy.externalmarkets.electricity.ElectricityPricesManager;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.collect.Range;

@RestController
@RequestMapping("/market/electricity")
public class ElectricityPricesController {

    @Resource
    private ElectricityPricesManager electricityPricesManager;

    @GetMapping("price")
    public ResponseEntity<List<DailyElectricityPriceDTO>> getElectricityPrices(
            @RequestParam(name = "from") String from,
            @RequestParam(name = "to") String to) {

        Map<LocalDate, BigDecimal> dailyPrices = electricityPricesManager.getPricesForPeriod(
                Range.closed(LocalDate.parse(from), LocalDate.parse(to))
        );

        List<DailyElectricityPriceDTO> dailyPricesResponse = dailyPrices.entrySet()
                .stream()
                .map(this::convertToDTO)
                .sorted((o1, o2) -> o1.getDate().isAfter(o2.getDate()) ? 1 : -1)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dailyPricesResponse);
    }

    public DailyElectricityPriceDTO convertToDTO(Map.Entry<LocalDate, BigDecimal> dailyPriceEntry) {
        return new DailyElectricityPriceDTO(dailyPriceEntry.getKey(), dailyPriceEntry.getValue());
    }
}
