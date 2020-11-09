package jmnet.moka.core.tps.common.code;

/**
 * Jpod 출연진 유형
 */
public enum JpodMemberTypeCode {
    CM("CM", "채널진행자"),
    CP("CP", "채널패널"),
    EG("EG", "에피소드게스트");

    private String code;
    private String name;

    JpodMemberTypeCode(String code, String name) {
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
