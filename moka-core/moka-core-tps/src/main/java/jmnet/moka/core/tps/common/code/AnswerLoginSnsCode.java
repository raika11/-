/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.common.code;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import jmnet.moka.common.utils.MapBuilder;

/**
 * Description: 시민마이크 답변 SNS로그인 타입
 *
 * @author ssc
 * @since 2021-01-26
 */
public enum AnswerLoginSnsCode {
    JOONGANG("J", "중앙"),
    FACEBOOK("F", "페이스북"),
    TWITER("T", "트위터"),
    USER("K", "사용자"),
    ADMIN("P", "시민마이크");

    private String code;
    private String name;

    AnswerLoginSnsCode(String code, String name) {
        this.code = code;
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    // String -> Enum 으로 조회하기 위해 추가
    private static Map<String, AnswerLoginSnsCode> TYPE_MAP = null;

    static {
        Map<String, AnswerLoginSnsCode> map = new ConcurrentHashMap<String, AnswerLoginSnsCode>();
        for (AnswerLoginSnsCode instance : AnswerLoginSnsCode.values()) {
            map.put(instance.getCode(), instance);
        }
        TYPE_MAP = Collections.unmodifiableMap(map);
    }

    public static AnswerLoginSnsCode get(String code) {
        return TYPE_MAP.get(code);
    }

    public static List<Map<String, Object>> toList() {

        return Arrays
                .stream(AnswerLoginSnsCode.values())
                .map(statusCode -> MapBuilder
                        .getInstance()
                        .add("code", statusCode.code)
                        .add("name", statusCode.name)
                        .getMap())
                .collect(Collectors.toList());
    }
}
