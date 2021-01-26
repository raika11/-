/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.common.code;

import java.util.Collections;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Description: 아젠다 타입
 *
 * @author ssc
 * @since 2021-01-26
 */
public enum AgendaTypeCode {
    DEFAULT("0", "일반"),
    OTHER("", "");

    private String code;
    private String name;

    AgendaTypeCode(String code, String name) {
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
    private static Map<String, AgendaTypeCode> TYPE_MAP = null;

    static {
        Map<String, AgendaTypeCode> map = new ConcurrentHashMap<String, AgendaTypeCode>();
        for (AgendaTypeCode instance : AgendaTypeCode.values()) {
            map.put(instance.getCode(), instance);
        }
        TYPE_MAP = Collections.unmodifiableMap(map);
    }

    public static AgendaTypeCode get(String code) {
        return TYPE_MAP.get(code);
    }
}
