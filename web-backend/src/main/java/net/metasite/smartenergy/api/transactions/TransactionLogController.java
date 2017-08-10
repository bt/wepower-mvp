package net.metasite.smartenergy.api.transactions;

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
                logDTO.getFrom(),
                logDTO.getTo(),
                logDTO.getDate(),
                logDTO.getTransactionId(),
                logDTO.getAmount());

        return ResponseEntity.ok().build();
    }

    @GetMapping("from")
    public ResponseEntity<List<TransactionLogDTO>> getLogsFrom(
            @RequestParam("from") String from,
            @RequestParam("date") @DateTimeFormat(pattern="yyyy-MM-dd") LocalDate date) {

        List<TransactionLogDTO> transactionLogs =
            transactionLogManager.getFrom(from, date)
                .stream()
                .map(this::convert)
                .collect(Collectors.toList());

        return ResponseEntity.ok(transactionLogs);
    }

    @GetMapping("to")
    public ResponseEntity<List<TransactionLogDTO>> getLogsTo(
            @RequestParam("to") String to,
            @RequestParam("date") @DateTimeFormat(pattern="yyyy-MM-dd") LocalDate date) {

        List<TransactionLogDTO> transactionLogs = new LinkedList<>();
       /*         transactionLogManager.getTo(to, date)
                        .stream()
                        .map(this::convert)
                        .collect(Collectors.toList());*/

        return ResponseEntity.ok(transactionLogs);
    }

    private TransactionLogDTO convert(TransactionLog log) {
        return new TransactionLogDTO(
                log.getFrom(),
                log.getTo(),
                log.getDate(),
                log.getTransaction(),
                log.getAmount()
        );
    }

}
