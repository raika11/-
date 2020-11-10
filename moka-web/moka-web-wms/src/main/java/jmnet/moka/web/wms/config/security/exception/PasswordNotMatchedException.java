package jmnet.moka.web.wms.config.security.exception;

/**
 * <pre>
 * 비밀번호 변경 기간 초과 오류 처리
 * Project : moka
 * Package : jmnet.moka.web.wms.config.security.exception
 * ClassName : PasswordUnchangedException
 * Created : 2020-11-04 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-04 13:31
 */
public class PasswordNotMatchedException extends AbstractAuthenticationException {
    public PasswordNotMatchedException(String msg) {
        super(UnauthrizedErrorCode.PASSWORD_UNMATCHED, msg);
    }

    public PasswordNotMatchedException(String msg, Throwable t) {
        super(UnauthrizedErrorCode.PASSWORD_UNMATCHED, msg, t);
    }
}
