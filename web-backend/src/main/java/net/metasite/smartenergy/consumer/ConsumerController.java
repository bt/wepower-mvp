package net.metasite.smartenergy.consumer;

import net.metasite.smartenergy.consumer.request.ConsumerDetailsDTO;
import net.metasite.smartenergy.consumer.response.CreatedConsumerDTO;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/consumer")
public class ConsumerController {

    @PostMapping
    public ResponseEntity<CreatedConsumerDTO> createConsumer(@RequestBody ConsumerDetailsDTO request) {

        // TODO: Implement persistance

        return ResponseEntity.ok(new CreatedConsumerDTO(1L));
    }
}
