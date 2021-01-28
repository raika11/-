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
 * 견학 상태
 */
public enum TourStatusCode {
    REQUEST("S", "신청"),
    ACCEPT("A", "승인"),
    RETURN("R", "반려"),
    CANCEL("C", "취소");

    private String code;
    private String name;

    TourStatusCode(String code, String name) {
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
                .stream(TourStatusCode.values())
                .map(statusCode -> MapBuilder
                        .getInstance()
                        .add("code", statusCode.code)
                        .add("name", statusCode.name)
                        .getMap())
                .collect(Collectors.toList());
    }
}
