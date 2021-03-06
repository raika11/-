/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.common.code;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonFormat.Shape;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import jmnet.moka.common.utils.MapBuilder;

/**
 * Description: 아젠다 기사화 단계
 *
 * @author ssc
 * @since 2021-01-26
 */
@JsonFormat(shape = Shape.OBJECT)
public enum AgendaArticleProgressCode {
    NONE("0", "미노출"),
    FEEDBACK("1", "의견수렴"),
    REVIEW("2", "검토중"),
    ARTICLE_ING("3", "취재중"),
    ARTICLE("4", "기사화");

    private String code;
    private String name;

    AgendaArticleProgressCode(String code, String name) {
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
    private static Map<String, AgendaArticleProgressCode> TYPE_MAP = null;

    static {
        Map<String, AgendaArticleProgressCode> map = new ConcurrentHashMap<String, AgendaArticleProgressCode>();
        for (AgendaArticleProgressCode instance : AgendaArticleProgressCode.values()) {
            map.put(instance.getCode(), instance);
        }
        TYPE_MAP = Collections.unmodifiableMap(map);
    }

    public static AgendaArticleProgressCode get(String code) {
        return TYPE_MAP.get(code);
    }

    public static List<Map<String, Object>> toList() {

        return Arrays
                .stream(AgendaArticleProgressCode.values())
                .map(statusCode -> MapBuilder
                        .getInstance()
                        .add("code", statusCode.code)
                        .add("name", statusCode.name)
                        .getMap())
                .collect(Collectors.toList());
    }
}
