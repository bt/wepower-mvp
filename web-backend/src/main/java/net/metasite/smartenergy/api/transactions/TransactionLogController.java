package net.metasite.smartenergy.api.transactions;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import net.metasite.smartenergy.domain.TransactionLog;
import net.metasite.smartenergy.transactions.TransactionLogManager;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/transaction/log")
public class TransactionLogController {

    @Resource
    private TransactionLogManager transactionLogManager;

    @PostMapping
    public ResponseEntity<Void> log(@RequestBody TransactionLogDTO logDTO) {

        transactionLogManager.log(
                logDTO.getFrom(),
                logDTO.getTo(),
                logDTO.getDate(),
                logDTO.getTransactionId());

        return ResponseEntity.ok().build();
    }

    @GetMapping("from/{from}/{date}")
    public ResponseEntity<List<TransactionLogDTO>> getLogsFrom(
            @PathVariable("from") String from,
            @PathVariable("date") LocalDate date) {

        List<TransactionLogDTO> transactionLogs =
            transactionLogManager.getFrom(from, date)
                .stream()
                .map(this::convert)
                .collect(Collectors.toList());

        return ResponseEntity.ok(transactionLogs);
    }

    @GetMapping("to/{to}/{date}")
    public ResponseEntity<List<TransactionLogDTO>> getLogsTo(
            @PathVariable("to") String to,
            @PathVariable("date") LocalDate date) {

        List<TransactionLogDTO> transactionLogs =
                transactionLogManager.getTo(to, date)
                        .stream()
                        .map(this::convert)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(transactionLogs);
    }

    private TransactionLogDTO convert(TransactionLog log) {
        return new TransactionLogDTO(
                log.getFrom(),
                log.getTo(),
                log.getDate(),
                log.getTransaction()
        );
    }

}
