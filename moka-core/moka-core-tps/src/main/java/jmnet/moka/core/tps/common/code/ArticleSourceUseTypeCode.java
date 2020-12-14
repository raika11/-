package jmnet.moka.core.tps.common.code;

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

}
