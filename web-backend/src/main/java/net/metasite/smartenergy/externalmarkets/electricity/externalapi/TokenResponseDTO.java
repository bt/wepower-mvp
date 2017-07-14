package net.metasite.smartenergy.externalmarkets.electricity.externalapi;

public class TokenResponseDTO {
    private String accessToken;
    private Long expiresIn;

    public TokenResponseDTO() {
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public Long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(Long expiresIn) {
        this.expiresIn = expiresIn;
    }
}
