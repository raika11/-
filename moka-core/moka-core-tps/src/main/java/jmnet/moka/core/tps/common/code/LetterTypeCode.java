package jmnet.moka.core.tps.common.code;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import jmnet.moka.common.utils.MapBuilder;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.common.code
 * ClassName : LetterTypeCode
 * Created : 2021-04-22 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-22 오전 10:25
 */
public enum LetterTypeCode {

    O("O", "오리지널"),
    B("B", "브리핑"),
    N("N", "알림"),
    E("E", "기타");

    private String code;
    private String name;

    LetterTypeCode(String code, String name) {
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
                .stream(LetterTypeCode.values())
                .map(statusCode -> MapBuilder
                        .getInstance()
                        .add("code", statusCode.code)
                        .add("name", statusCode.name)
                        .getMap())
                .collect(Collectors.toList());
    }
}
