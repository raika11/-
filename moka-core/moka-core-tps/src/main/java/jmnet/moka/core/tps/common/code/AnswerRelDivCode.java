/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.common.code;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import jmnet.moka.common.utils.MapBuilder;

/**
 * Description: 시민마이크 답변 부가정보의 타입
 *
 * @author ssc
 * @since 2021-01-26
 */
public enum AnswerRelDivCode {
    NONE("", "단문"),
    IMAGE("I", "이미지"),
    MOVIE("M", "동영상"),
    ARTICLE("A", "기사");

    private String code;
    private String name;

    AnswerRelDivCode(String code, String name) {
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
                .stream(AnswerRelDivCode.values())
                .map(statusCode -> MapBuilder
                        .getInstance()
                        .add("code", statusCode.code)
                        .add("name", statusCode.name)
                        .getMap())
                .collect(Collectors.toList());
    }
}
