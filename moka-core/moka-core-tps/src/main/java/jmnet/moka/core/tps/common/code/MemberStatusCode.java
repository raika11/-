package jmnet.moka.core.tps.common.code;

/**
 * 사용자 상태 코드
 */
public enum MemberStatusCode {
    N("N", "신규"),
    Y("Y", "활성"),
    P("P", "잠김"),
    R("R", "잠기 해제 요청"),
    D("D", "삭제");

    private String code;
    private String name;

    MemberStatusCode(String code, String name) {
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
