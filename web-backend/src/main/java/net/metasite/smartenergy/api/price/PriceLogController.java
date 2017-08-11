package net.metasite.smartenergy.api.price;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import net.metasite.smartenergy.prices.PriceLogManager;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(("/price/log"))
public class PriceLogController {

    @Resource
    private PriceLogManager priceLogManager;

    @PostMapping
    public ResponseEntity<Void> log(@RequestBody PriceLogDTO logDTO) {
        priceLogManager.log(logDTO.getPlant(), logDTO.getPrice(), logDTO.getDate());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/period")
    public ResponseEntity<List<DatesPricesDTO>> getForDates(
            @RequestParam String plant,
            @RequestParam @DateTimeFormat(pattern="yyyy-MM-dd") LocalDate from,
            @RequestParam @DateTimeFormat(pattern="yyyy-MM-dd") LocalDate to) {

        final Map<LocalDate, BigDecimal> prices = priceLogManager.getFromTo(plant, from, to);
        final List<DatesPricesDTO> datesPrices = prices.entrySet().stream()
                .map(e -> new DatesPricesDTO(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(datesPrices);

    }

    @GetMapping("/date")
    public ResponseEntity<BigDecimal> getForDates(
            @RequestParam String plant,
            @RequestParam @DateTimeFormat(pattern="yyyy-MM-dd") LocalDate date) {

        final BigDecimal price = priceLogManager.getFor(plant, date);
        return ResponseEntity.ok(price);
    }


}
