package jmnet.moka.core.tps.common.code;

/**
 * 사용자 상태 코드
 */
public enum MemberStatusCode {
    Y("Y", "활성"),
    P("P", "패스워드 오류 회수 초과"),
    N("N", "비활성");

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
}
