package net.metasite.smartenergy.api.transactions;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.websocket.server.PathParam;

import net.metasite.smartenergy.domain.TransactionLog;
import net.metasite.smartenergy.transactions.TransactionLogManager;

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
@RequestMapping("/transaction/log")
public class TransactionLogController {

    @Resource
    private TransactionLogManager transactionLogManager;

    @PostMapping
    public ResponseEntity<Void> log(@RequestBody TransactionLogDTO logDTO) {

        transactionLogManager.log(
                logDTO.getPlant(),
                logDTO.getConsumer(),
                logDTO.getDate(),
                logDTO.getTransactionId(),
                logDTO.getAmountEth(),
                logDTO.getAmountKwh());

        return ResponseEntity.ok().build();
    }

    @GetMapping("consumer")
    public ResponseEntity<List<TransactionLogDTO>> getLogsFrom(
            @RequestParam("consumer") String consumer,
            @RequestParam("date") @DateTimeFormat(pattern="yyyy-MM-dd") LocalDate date) {

        List<TransactionLogDTO> transactionLogs =
            transactionLogManager.getForConsumer(consumer, date)
                .stream()
                .map(this::convert)
                .collect(Collectors.toList());

        return ResponseEntity.ok(transactionLogs);
    }

    @GetMapping("plant")
    public ResponseEntity<List<TransactionLogDTO>> getPlantLogs(
            @RequestParam("plant") String to,
            @RequestParam("date") @DateTimeFormat(pattern="yyyy-MM-dd") LocalDate date) {

        List<TransactionLogDTO> transactionLogs = transactionLogManager.getForPlant(to, date)
                        .stream()
                        .map(this::convert)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(transactionLogs);
    }

    private TransactionLogDTO convert(TransactionLog log) {
        if (!log.getAmountEth().equals(BigDecimal.ZERO)) {
            System.out.println("!");
        }
        return new TransactionLogDTO(
                log.getPlant(),
                log.getConsumer(),
                log.getDate(),
                log.getTransaction(),
                log.getAmountEth(),
                log.getAmountKwh()
        );
    }

}
