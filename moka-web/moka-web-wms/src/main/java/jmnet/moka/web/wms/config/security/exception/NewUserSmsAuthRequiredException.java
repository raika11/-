package jmnet.moka.web.wms.config.security.exception;

/**
 * <pre>
 * 신규 회원이 sms 인증 하지 않고 로그인 한 경우 에러 처리
 * Project : moka
 * Package : jmnet.moka.web.wms.config.security.exception
 * ClassName : AccountStatusUnactiveException
 * Created : 2020-11-04 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-04 17:15
 */
public class NewUserSmsAuthRequiredException extends AbstractAuthenticationException {
    public NewUserSmsAuthRequiredException(String msg) {
        super(UnauthrizedErrorCode.SMS_REQUIRED, msg);
    }

    public NewUserSmsAuthRequiredException(String msg, Throwable t) {
        super(UnauthrizedErrorCode.SMS_REQUIRED, msg, t);
    }
}
