package net.metasite.smartenergy.consumer;

import javax.annotation.Resource;

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

    @Resource
    private ConsumerFactory consumerFactory;

    /**
     * Controller is, and will be used only by Front-end,
     *  therefore we Ignore HTTP specification and instead of 201+location header
     *  return 200 + resource Id in response body
     *
     * @param request
     * @return
     */
    @PostMapping
    public ResponseEntity<CreatedConsumerDTO> createConsumer(@RequestBody ConsumerDetailsDTO request) {

        Long consumerId = consumerFactory.create(
                request.getWalletId(),
                request.getAreaCode(),
                request.getMeterId(),
                request.getConsumption(),
                request.getHouseSizeCode()
        );

        return ResponseEntity.ok(new CreatedConsumerDTO(consumerId));
    }
}
