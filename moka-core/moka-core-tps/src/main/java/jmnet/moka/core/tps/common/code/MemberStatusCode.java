package jmnet.moka.core.tps.common.code;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import jmnet.moka.common.utils.MapBuilder;

/**
 * 사용자 상태 코드
 */
public enum MemberStatusCode {
    N("N", "신규"),
    Y("Y", "활성"),
    P("P", "잠김"),
    R("R", "잠금 해제 요청"),
    D("D", "삭제"),
    I("I", "신청중");

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

    public static List<Map<String, Object>> toList() {

        return Arrays
                .stream(MemberStatusCode.values())
                .map(memberStatusCode -> MapBuilder
                        .getInstance()
                        .add("code", memberStatusCode.code)
                        .add("name", memberStatusCode.name)
                        .getMap())
                .collect(Collectors.toList());
    }
}
