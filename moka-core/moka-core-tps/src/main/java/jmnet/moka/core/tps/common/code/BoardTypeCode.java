package jmnet.moka.core.tps.common.code;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import jmnet.moka.common.utils.MapBuilder;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.common.code
 * ClassName : BoardTypeCode
 * Created : 2020-12-18 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-18 12:01
 */
public enum BoardTypeCode {

    A("A", "관리자"),
    S("S", "서비스");

    private String code;
    private String name;

    BoardTypeCode(String code, String name) {
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
                .stream(BoardTypeCode.values())
                .map(boardTypeCode -> MapBuilder
                        .getInstance()
                        .add("code", boardTypeCode.code)
                        .add("name", boardTypeCode.name)
                        .getMap())
                .collect(Collectors.toList());
    }
}
