package jmnet.moka.core.tps.common.code;

/**
 * 편집 폼 상태 코드
 */
public enum EditStatusCode {
    SAVE("SAVE", "임시저장"),
    PUBLISH("PUBLISH", "배포");

    private String code;
    private String name;

    EditStatusCode(String code, String name) {
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
