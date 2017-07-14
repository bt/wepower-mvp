package net.metasite.smartenergy.externalmarkets.electricity.externalapi;

public class TokenRequestDTO {
    private String grantType;

    private String scope;

    private String username;

    private String password;

    public TokenRequestDTO(String grantType, String scope, String username, String password) {
        this.grantType = grantType;
        this.scope = scope;
        this.username = username;
        this.password = password;
    }

    public String getGrantType() {
        return grantType;
    }

    public String getScope() {
        return scope;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }
}
