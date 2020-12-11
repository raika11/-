package jmnet.moka.web.wms.config.security.exception;

/**
 * <pre>
 * 비밀번호 입력 오류 제한 처리
 * Project : moka
 * Package : jmnet.moka.web.wms.config.security.exception
 * ClassName : LimitExcessBadCredentialsException
 * Created : 2020-11-04 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-04 13:31
 */
public class LimitExcessBadCredentialsException extends AbstractAuthenticationException {
    public LimitExcessBadCredentialsException(String msg, int limit) {
        super(UnauthrizedErrorCode.PASSWORD_LIMIT, msg, limit);
    }

    public LimitExcessBadCredentialsException(String msg, Throwable t) {
        super(UnauthrizedErrorCode.PASSWORD_LIMIT, msg, t);
    }
}
