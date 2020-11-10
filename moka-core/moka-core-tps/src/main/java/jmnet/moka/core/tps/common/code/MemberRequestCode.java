package jmnet.moka.core.tps.common.code;

/**
 * 사용자 잠금해제 유형 코드
 */
public enum MemberRequestCode {
    UNLOCK_REQUEST("UNLOCK_REQUEST", "잠금해제 요청"),
    UNLOCK_SMS("UNLOCK_SMS", "잠금해제 인증문자"),
    NEW_REQUEST("NEW_REQUEST", "신규요청"),
    NEW_SMS("NEW_SMS", "신규 인증문자");

    private String code;
    private String name;

    MemberRequestCode(String code, String name) {
        this.code = code;
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public static String getRegexp() {
        return "[Y|N]{1}$";
    }
}
