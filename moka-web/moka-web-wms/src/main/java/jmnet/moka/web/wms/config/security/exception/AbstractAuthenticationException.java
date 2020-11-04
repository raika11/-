package jmnet.moka.web.wms.config.security.exception;

import org.springframework.security.core.AuthenticationException;

/**
 * <pre>
 * 인증 오류 처리 추상 클래스
 * Project : moka
 * Package : jmnet.moka.web.wms.config.security.exception
 * ClassName : AbstractAuthenticationException
 * Created : 2020-11-04 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-04 13:31
 */
public abstract class AbstractAuthenticationException extends AuthenticationException {

    protected UnauthrizedErrorCode errorCode;

    public AbstractAuthenticationException(UnauthrizedErrorCode errorCode, String msg) {
        super(msg);
        this.errorCode = errorCode;
    }

    public AbstractAuthenticationException(UnauthrizedErrorCode errorCode, String msg, Throwable t) {
        super(msg, t);
        this.errorCode = errorCode;
    }

    public UnauthrizedErrorCode getErrorCode() {
        return this.errorCode = errorCode;
    }
}
