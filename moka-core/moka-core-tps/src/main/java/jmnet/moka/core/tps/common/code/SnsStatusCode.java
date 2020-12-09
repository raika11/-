package jmnet.moka.core.tps.common.code;

/**
 * SNS 상태 코드
 */
public enum SnsStatusCode {
    I("I", "INSERT"),
    U("U", "UPDATE"),
    D("D", "DELETE");

    private String code;
    private String name;

    SnsStatusCode(String code, String name) {
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
