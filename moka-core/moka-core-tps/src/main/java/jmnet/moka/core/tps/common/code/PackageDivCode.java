/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.common.code;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import jmnet.moka.common.utils.EnumCode;
import jmnet.moka.common.utils.MapBuilder;

/**
 * <pre>
 * 패키지타입
 * Project : moka
 * Package : jmnet.moka.core.tps.common.code
 * ClassName : LinkTargetCode
 * Created : 2021-02-02 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-02 16:24
 */
public enum PackageDivCode implements EnumCode {
    ISSUE("I", "이슈"),
    TOPIC("T", "토픽"),
    SERIES("S", "시리즈");

    private String code;
    private String name;

    PackageDivCode(String code, String name) {
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
                .stream(PackageDivCode.values())
                .map(code -> MapBuilder
                        .getInstance()
                        .add("code", code.code)
                        .add("name", code.name)
                        .getMap())
                .collect(Collectors.toList());
    }
}
