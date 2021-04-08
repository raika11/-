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
 * 편집기사 채널타입 기사A/ 더미기사D/영상M/패키지I/기자R/칼럼니스트C
 */
public enum ChannelTypeCode {
    ARTICLE("A", "기사"),
    DUMMY("D", "더미기사"),
    MOVIE("M", "영상"),
    PACKAGE("I", "패키지"),
    REPORTER("R", "기자"),
    COLUMNIST("C", "칼럼니스트");

    private String code;
    private String name;

    ChannelTypeCode(String code, String name) {
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
                .stream(ChannelTypeCode.values())
                .map(statusCode -> MapBuilder
                        .getInstance()
                        .add("code", statusCode.code)
                        .add("name", statusCode.name)
                        .getMap())
                .collect(Collectors.toList());
    }
}
