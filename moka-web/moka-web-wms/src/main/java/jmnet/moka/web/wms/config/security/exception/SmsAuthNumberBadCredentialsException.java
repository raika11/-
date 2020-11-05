package jmnet.moka.web.wms.config.security.exception;

/**
 * <pre>
 * SMS 인증 번호 불일치 에러 처리
 * Project : moka
 * Package : jmnet.moka.web.wms.config.security.exception
 * ClassName : SmsAuthNumberBadCredentialsException
 * Created : 2020-11-04 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-04 17:20
 */
public class SmsAuthNumberBadCredentialsException extends AbstractAuthenticationException {
    public SmsAuthNumberBadCredentialsException(String msg) {
        super(UnauthrizedErrorCode.SMS_UNMATCHED, msg);
    }

    public SmsAuthNumberBadCredentialsException(String msg, Throwable t) {
        super(UnauthrizedErrorCode.SMS_UNMATCHED, msg, t);
    }
}
