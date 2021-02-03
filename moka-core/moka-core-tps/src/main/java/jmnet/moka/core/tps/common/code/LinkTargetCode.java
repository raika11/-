package jmnet.moka.core.tps.common.code;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import jmnet.moka.common.data.mybatis.support.EnumCode;
import jmnet.moka.common.utils.MapBuilder;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.common.code
 * ClassName : LinkTargetCode
 * Created : 2021-02-02 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-02 16:24
 */
public enum LinkTargetCode implements EnumCode {
    S("S", "본창"),
    N("N", "새창");

    private String code;
    private String name;

    LinkTargetCode(String code, String name) {
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
                .stream(LinkTargetCode.values())
                .map(code -> MapBuilder
                        .getInstance()
                        .add("code", code.code)
                        .add("name", code.name)
                        .getMap())
                .collect(Collectors.toList());
    }
}
