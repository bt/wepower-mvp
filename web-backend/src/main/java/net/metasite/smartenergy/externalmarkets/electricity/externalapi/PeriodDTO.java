package net.metasite.smartenergy.externalmarkets.electricity.externalapi;

import java.util.List;

public class PeriodDTO {

    private List<IntervalDTO> interval;

    public PeriodDTO() {
    }

    public List<IntervalDTO> getInterval() {
        return interval;
    }

    public void setInterval(List<IntervalDTO> interval) {
        this.interval = interval;
    }
}
