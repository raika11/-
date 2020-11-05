package jmnet.moka.web.wms.config.security.exception;

/**
 * <pre>
 * SMS 인증 번호 만료 에러 처리
 * Project : moka
 * Package : jmnet.moka.web.wms.config.security.exception
 * ClassName : SmsAuthNumberExpiredException
 * Created : 2020-11-04 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-04 17:20
 */
public class SmsAuthNumberExpiredException extends AbstractAuthenticationException {
    public SmsAuthNumberExpiredException(String msg) {
        super(UnauthrizedErrorCode.EXPIRE_DATE, msg);
    }

    public SmsAuthNumberExpiredException(String msg, Throwable t) {
        super(UnauthrizedErrorCode.EXPIRE_DATE, msg, t);
    }
}
