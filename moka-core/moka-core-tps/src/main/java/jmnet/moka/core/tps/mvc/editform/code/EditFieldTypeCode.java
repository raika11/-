package jmnet.moka.core.tps.mvc.editform.code;

import java.util.Arrays;

/**
 * <pre>
 * 메뉴 권한 유형 코드
 * Project : moka
 * Package : jmnet.moka.core.tps.common.code
 * ClassName : EditFieldTypeCode
 * Created : 2020-10-25 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-25 07:36
 */
public enum EditFieldTypeCode {
    TEXT("TEXT", "텍스트"),
    IMAGE("IMAGE", "이미지"),
    SELECT("SELECT", "선택"),
    CONTENT("CONTENT", "내용"),
    SEPARATOR("SEPARATOR", "구분선"),
    REPORTER("REPORTER", "기자명"),
    LINK("LINK", "링크"),
    HIDDEN("HIDDEN", "hidden"),
    ISSUE("ISSUE", "이슈"),
    COLORSELECTOR("COLORSELECTOR", "배경색"),
    ISSUESERIES("ISSUESERIES", "이슈 시리즈"),
    OVPLIVE("OVPLIVE", "OVP");

    private String code;
    private String name;

    EditFieldTypeCode(String code, String name) {
        this.code = code;
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public static EditFieldTypeCode getType(String code) {
        return Arrays
                .stream(EditFieldTypeCode.values())
                .filter(editFieldTypeCode -> editFieldTypeCode.code.equals(code))
                .findFirst()
                .orElse(TEXT);
    }
}
