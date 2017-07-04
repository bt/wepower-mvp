package net.metasite.smartenergy.house.response;

public class HouseSizeDTO {
    private String sizeCode;
    private String shortDescription;

    public HouseSizeDTO(String sizeCode, String shortDescription) {
        this.sizeCode = sizeCode;
        this.shortDescription = shortDescription;
    }

    public String getSizeCode() {
        return sizeCode;
    }

    public String getShortDescription() {
        return shortDescription;
    }
}
