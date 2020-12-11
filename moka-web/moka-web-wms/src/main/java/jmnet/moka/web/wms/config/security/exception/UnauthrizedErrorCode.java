package jmnet.moka.web.wms.config.security.exception;

import java.util.HashMap;
import java.util.Map;

/**
 * <pre>
 * 인증 오류 코드
 * Project : moka
 * Package : jmnet.moka.web.wms.config.security.exception
 * ClassName : UnauthrizedErrorCode
 * Created : 2020-11-04 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-04 13:31
 */
public enum UnauthrizedErrorCode {
    GROUPWARE_NOTFOUND(100, "GROUPWARE_NOTFOUND"),
    USERNAME_NOTFOUND(101, "USERNAME_NOTFOUND"),
    PASSWORD_UNMATCHED(102, "PASSWORD_UNMATCHED"),
    PASSWORD_LIMIT(103, "PASSWORD_LIMIT"),
    USER_STATUS(104, "USER_STATUS"),
    EXPIRE_DATE(105, "EXPIRE_DATE"),
    LONG_TERM(106, "LONG_TERM"),
    PASSWORD_UNCHANGE(107, "PASSWORD_UNCHANGE"),
    SMS_UNMATCHED(108, "SMS_UNMATCHED"),
    SMS_EXPIRED(109, "SMS_EXPIRED"),
    SMS_REQUIRED(110, "SMS_REQUIRED"),
    GROUPWARE_ERROR(901, "GROUPWARE_ERROR"),
    GROUPWARE_AUTHNUMBER_PARSING_ERROR(902, "GROUPWARE_AUTHNUMBER_ERROR"),
    GROUPWARE_AUTHNUMBER_ERROR(903, "GROUPWARE_AUTHNUMBER_ERROR"),
    GROUPWARE_USER_PARSING_ERROR(904, "GROUPWARE_USER_PARSING_ERROR"),
    PASSWORD_NOTI(999, "PASSWORD_NOTI");

    private final Integer code;
    private final String name;

    UnauthrizedErrorCode(int code, String name) {
        this.code = code;
        this.name = name;
    }

    public int getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public static Map<Integer, UnauthrizedErrorCode> getMap() {
        Map<Integer, UnauthrizedErrorCode> codeMap = new HashMap<>();
        UnauthrizedErrorCode[] errorCodes = UnauthrizedErrorCode.values();
        for (UnauthrizedErrorCode code : errorCodes) {
            codeMap.put(code.getCode(), code);
        }
        return codeMap;
    }

    public Map<String, Object> toMap() {
        Map<String, Object> codeMap = new HashMap<>();
        codeMap.put("code", this.code);
        codeMap.put("name", this.name);
        return codeMap;
    }
}
