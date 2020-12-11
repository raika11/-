package jmnet.moka.web.wms.config.security.exception;

/**
 * <pre>
 * 비밀번호 오류 에러 처리
 * Project : moka
 * Package : jmnet.moka.web.wms.config.security.exception
 * ClassName : WmsBadCredentialsException
 * Created : 2020-11-04 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-04 13:31
 */
public class WmsBadCredentialsException extends AbstractAuthenticationException {
    public WmsBadCredentialsException(String msg) {
        super(UnauthrizedErrorCode.GROUPWARE_NOTFOUND, msg);
    }

    public WmsBadCredentialsException(String msg, int limit) {
        super(UnauthrizedErrorCode.GROUPWARE_NOTFOUND, msg, limit);
    }

    public WmsBadCredentialsException(String msg, Throwable t) {
        super(UnauthrizedErrorCode.GROUPWARE_NOTFOUND, msg, t);
    }
}
