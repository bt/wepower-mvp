package net.metasite.smartenergy.consumer;

import java.math.BigDecimal;

import net.metasite.smartenergy.consumer.request.ConsumerDetailsDTO;
import net.metasite.smartenergy.consumer.response.CreatedConsumerDTO;
import net.metasite.smartenergy.domain.Consumer;
import net.metasite.smartenergy.domain.SupportedHouseSize;
import net.metasite.smartenergy.domain.SupportedLocationArea;
import net.metasite.smartenergy.repositories.ConsumerRepository;
import net.metasite.smartenergy.repositories.SupportedHouseSizeRepository;
import net.metasite.smartenergy.repositories.SupportedLocationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Service
public class ConsumerFactory {

    private SupportedLocationRepository supportedLocationArea;

    private SupportedHouseSizeRepository supportedHouseSizeRepository;

    private ConsumerRepository consumerRepository;

    @Autowired
    public ConsumerFactory(
            SupportedLocationRepository supportedLocationArea,
            SupportedHouseSizeRepository supportedHouseSizeRepository,
            ConsumerRepository consumerRepository) {
        this.supportedLocationArea = supportedLocationArea;
        this.supportedHouseSizeRepository = supportedHouseSizeRepository;
        this.consumerRepository = consumerRepository;
    }

    @Transactional
    public Long create(
            String walletId,
            String areaCode,
            String meterId,
            BigDecimal consumption,
            String houseSizeCode) {

        SupportedLocationArea locationArea = supportedLocationArea.findByCode(areaCode);
        SupportedHouseSize houseSize = supportedHouseSizeRepository.findByCode(houseSizeCode);

        Consumer consumer = new Consumer(
                walletId,
                meterId,
                consumption,
                locationArea,
                houseSize
        );

        consumerRepository.save(consumer);

        return consumer.getId();
    }
}
