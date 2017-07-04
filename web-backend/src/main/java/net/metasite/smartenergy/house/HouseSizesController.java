package net.metasite.smartenergy.house;

import java.util.List;

import net.metasite.smartenergy.house.response.HouseSizeDTO;
import net.metasite.smartenergy.locationareas.response.AreaDTO;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.collect.ImmutableList;


@RestController
@RequestMapping("/house-size")
public class HouseSizesController {

    @GetMapping
    public List<HouseSizeDTO> getSupportedSizes() {

        // TODO: Implement persistance layer

        return ImmutableList.of(
                new HouseSizeDTO("S", "10 - 50 m2"),
                new HouseSizeDTO("M", "50 - 100 m2"),
                new HouseSizeDTO("L", "100 - 150 m2")
        );
    }
}
