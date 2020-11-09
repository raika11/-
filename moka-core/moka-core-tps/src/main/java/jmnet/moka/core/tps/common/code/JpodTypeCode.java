package jmnet.moka.core.tps.common.code;

/**
 * Jpod 유형 코드
 */
public enum JpodTypeCode {
    A("A", "오디오"),
    V("V", "비디오");

    private String code;
    private String name;

    JpodTypeCode(String code, String name) {
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
