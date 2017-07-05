package net.metasite.smartenergy.locationareas;

import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import net.metasite.smartenergy.domain.SupportedLocationArea;
import net.metasite.smartenergy.locationareas.response.AreaDTO;
import net.metasite.smartenergy.repositories.SupportedLocationRepository;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/location-area")
public class LocationAreaController {

    @Resource
    private SupportedLocationRepository supportedLocationRepository;

    @GetMapping
    public List<AreaDTO> getSupportedLocations() {

        return supportedLocationRepository.findAll()
                .stream()
                .map(LocationAreaController::convertToDTO)
                .collect(Collectors.toList());
    }

    public static AreaDTO convertToDTO(SupportedLocationArea location) {
        return new AreaDTO(location.getCode(), location.getDescription());
    }
}
