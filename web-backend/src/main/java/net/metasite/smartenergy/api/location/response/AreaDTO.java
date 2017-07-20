package net.metasite.smartenergy.api.location.response;

public class AreaDTO {
    private String code;
    private String name;

    public AreaDTO(String code, String name) {
        this.code = code;
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }
}
