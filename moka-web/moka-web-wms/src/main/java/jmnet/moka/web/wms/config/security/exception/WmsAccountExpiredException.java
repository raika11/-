package jmnet.moka.web.wms.config.security.exception;

/**
 * <pre>
 * 인증 기간 만료 오류 처리
 * Project : moka
 * Package : jmnet.moka.web.wms.config.security.exception
 * ClassName : WmsAccountExpiredException
 * Created : 2020-11-04 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-04 17:20
 */
public class WmsAccountExpiredException extends AbstractAuthenticationException {
    public WmsAccountExpiredException(String msg) {
        super(UnauthrizedErrorCode.EXPIRE_DATE, msg);
    }

    public WmsAccountExpiredException(String msg, Throwable t) {
        super(UnauthrizedErrorCode.EXPIRE_DATE, msg, t);
    }
}
