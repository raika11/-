package jmnet.moka.core.tps.common.code;

import java.util.Collections;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * <pre>
 * 소스 코드 사용 유형 코드
 * Project : moka
 * Package : jmnet.moka.core.tps.common.code
 * ClassName : ArticleSourceUseTypeCode
 * Created : 2020-12-14 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-14 09:44
 */
public enum ArticleSourceUseTypeCode {
    JOONGANG("JOONGANG"),
    CONSALES("CONSALES"),
    JSTORE("JSTORE"),
    SOCIAL("SOCIAL"),
    BULK("BULK"),
    RCV("RCV");

    private String code;


    ArticleSourceUseTypeCode(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    // String -> Enum 으로 조회하기 위해 추가
    private static Map<String, ArticleSourceUseTypeCode> TYPE_MAP = null;

    static {
        Map<String, ArticleSourceUseTypeCode> map = new ConcurrentHashMap<String, ArticleSourceUseTypeCode>();
        for (ArticleSourceUseTypeCode instance : ArticleSourceUseTypeCode.values()) {
            map.put(instance.getCode(), instance);
        }
        TYPE_MAP = Collections.unmodifiableMap(map);
    }

    public static ArticleSourceUseTypeCode get(String code) {
        return TYPE_MAP.get(code);
    }

}
