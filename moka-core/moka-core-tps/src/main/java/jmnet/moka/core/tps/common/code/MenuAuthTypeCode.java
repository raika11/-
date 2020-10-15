package jmnet.moka.core.tps.common.code;

/**
 * 메뉴 권한 유형 코드
 */
public enum MenuAuthTypeCode {
    GROUP("G", "그룹"),
    MEMBER("U", "멤버");

    private String code;
    private String name;

    MenuAuthTypeCode(String code, String name) {
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
