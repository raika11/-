package jmnet.moka.core.tps.mvc.editform.code;

/**
 * 편집 폼 상태 코드
 */
public enum EditFormStatusCode {
    SAVE("SAVE", "임시저장"),
    PUBLISH("PUBLISH", "배포");

    private String code;
    private String name;

    EditFormStatusCode(String code, String name) {
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
