package net.metasite.ecryptoexchange;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Empty controller Ping/Pong controller used to validate successful initial project state.
 */
@RestController("/")
public class PingController {

    @GetMapping("ping")
    public String respondToPing() {
        return "pong";
    }
}
