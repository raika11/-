package jmnet.moka.core.tps.common.code;

/**
 * SNS 유형 코드
 */
public enum SnsTypeCode {
    FB("FB", "Facebook"),
    TW("TW", "Twitter"),
    JA("JA", "JA");

    private String code;
    private String name;

    SnsTypeCode(String code, String name) {
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
