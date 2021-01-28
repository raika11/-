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
 * Description: 시민마이크 답변 타입
 *
 * @author ssc
 * @since 2021-01-26
 */
public enum BulkSiteCode {
    NAVER("1", "네이버"),
    DAUM("2", "다음"),
    NATE("3", "네이트"),
    ZOOM("4", "줌"),
    ETC("5", "기타");

    private String code;
    private String name;

    BulkSiteCode(String code, String name) {
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
    private static Map<String, BulkSiteCode> TYPE_MAP = null;

    static {
        Map<String, BulkSiteCode> map = new ConcurrentHashMap<String, BulkSiteCode>();
        for (BulkSiteCode instance : BulkSiteCode.values()) {
            map.put(instance.getCode(), instance);
        }
        TYPE_MAP = Collections.unmodifiableMap(map);
    }

    public static BulkSiteCode get(String code) {
        return TYPE_MAP.get(code);
    }

    public static List<Map<String, Object>> toList() {

        return Arrays
                .stream(BulkSiteCode.values())
                .map(statusCode -> MapBuilder
                        .getInstance()
                        .add("code", statusCode.code)
                        .add("name", statusCode.name)
                        .getMap())
                .collect(Collectors.toList());
    }
}
