package jmnet.moka.core.tps.common.code;

/**
 * 디바이스 유형
 */
public enum DeviceTypeCode {
    P("P", "PC"),
    M("M", "Mobile");

    private String code;
    private String name;

    DeviceTypeCode(String code, String name) {
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
