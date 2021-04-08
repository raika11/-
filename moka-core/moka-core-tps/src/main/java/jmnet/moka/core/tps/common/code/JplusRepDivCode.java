package jmnet.moka.core.tps.common.code;

/**
 * 필진타입 코드(J1:기자필진,J2:외부기자(밀리터리),J3:그룹필진,J0:필진해지,R1:일보기자(더오래),R2:외부기자(더오래))
 */
public enum JplusRepDivCode {
    J1("J1", "기자필진"),
    J2("J2", "외부기자(밀리터리)"),
    J3("J3", "그룹필진"),
    J0("J0", "필진해지"),
    R1("R1", "일보기자(더오래)"),
    R2("R2", "외부기자(더오래)");

    private String code;
    private String name;

    JplusRepDivCode(String code, String name) {
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
