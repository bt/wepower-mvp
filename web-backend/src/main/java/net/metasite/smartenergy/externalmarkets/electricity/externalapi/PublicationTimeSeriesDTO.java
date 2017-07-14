package net.metasite.smartenergy.externalmarkets.electricity.externalapi;

import javax.xml.bind.annotation.XmlRootElement;

public class PublicationTimeSeriesDTO {

    private PeriodDTO period;

    public PublicationTimeSeriesDTO() {
    }

    public PeriodDTO getPeriod() {
        return period;
    }

    public void setPeriod(PeriodDTO period) {
        this.period = period;
    }
}
