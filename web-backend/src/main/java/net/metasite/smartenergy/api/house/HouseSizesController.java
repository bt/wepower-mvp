package net.metasite.smartenergy.api.house;

import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import net.metasite.smartenergy.api.house.response.HouseSizeDTO;
import net.metasite.smartenergy.domain.SupportedHouseSize;
import net.metasite.smartenergy.repositories.SupportedHouseSizeRepository;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/house-size")
public class HouseSizesController {

    @Resource
    private SupportedHouseSizeRepository supportedHouseSizeRepository;

    @GetMapping
    public List<HouseSizeDTO> getSupportedSizes() {
        return supportedHouseSizeRepository.findAll()
                .stream()
                .map(HouseSizesController::convertToDTO)
                .collect(Collectors.toList());
    }

    public static HouseSizeDTO convertToDTO(SupportedHouseSize size) {
        return new HouseSizeDTO(size.getCode(), size.getDescription());
    }
}
