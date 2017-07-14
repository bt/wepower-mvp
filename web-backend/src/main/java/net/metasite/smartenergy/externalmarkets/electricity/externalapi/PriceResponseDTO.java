package net.metasite.smartenergy.externalmarkets.electricity.externalapi;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class PriceResponseDTO {

    private PublicationTimeSeriesDTO publicationTimeSeries;

    public PriceResponseDTO() {
    }

    public PublicationTimeSeriesDTO getPublicationTimeSeries() {
        return publicationTimeSeries;
    }

    public void setPublicationTimeSeries(PublicationTimeSeriesDTO publicationTimeSeries) {
        this.publicationTimeSeries = publicationTimeSeries;
    }
}
