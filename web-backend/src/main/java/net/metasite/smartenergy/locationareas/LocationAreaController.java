package net.metasite.smartenergy.locationareas;

import java.util.List;

import net.metasite.smartenergy.locationareas.response.AreaDTO;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.collect.ImmutableList;

@RestController
@RequestMapping("/location-area")
public class LocationAreaController {

    @GetMapping
    public List<AreaDTO> getSupportedLocations() {

        // TODO: Implement persistance layer

        return ImmutableList.of(
                new AreaDTO("GER", "Germany"),
                new AreaDTO("ESP", "Spain"),
                new AreaDTO("ITA", "Italy")
        );
    }
}
