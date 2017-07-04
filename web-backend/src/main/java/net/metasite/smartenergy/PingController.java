package net.metasite.smartenergy;

import java.util.List;

import net.metasite.smartenergy.house.response.HouseSizeDTO;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.collect.ImmutableList;

/**
 * Empty controller Ping/Pong controller used to validate successful initial project state.
 */
@RestController()
public class PingController {

    @GetMapping("ping")
    public String respondToPing() {
        return "pong";
    }

}
