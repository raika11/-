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
 * ClassName : PhotoArchiveMenuCode
 * Created : 2020-12-16 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-16 09:25
 */
public enum PhotoArchiveMenuCode {
    PHOTO_DESK("PHOTO_DESK", "포토데스크", "320"),
    PHOTO_DB("PHOTO_DB", "사진DB", "119");

    private String code;
    private String name;
    private String menuNo;


    PhotoArchiveMenuCode(String code, String name, String menuNo) {
        this.code = code;
        this.name = name;
        this.menuNo = menuNo;
    }

    public String getMenuNo() {
        return menuNo;
    }

    public static List<Map<String, Object>> toList() {

        return Arrays
                .stream(PhotoArchiveMenuCode.values())
                .map(menuCode -> MapBuilder
                        .getInstance()
                        .add("code", menuCode.code)
                        .add("name", menuCode.name)
                        .getMap())
                .collect(Collectors.toList());
    }
}
