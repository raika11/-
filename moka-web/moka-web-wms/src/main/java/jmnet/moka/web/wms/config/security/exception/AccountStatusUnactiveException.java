package jmnet.moka.web.wms.config.security.exception;

/**
 * <pre>
 * 비활성화 계정 에러 처리
 * Project : moka
 * Package : jmnet.moka.web.wms.config.security.exception
 * ClassName : AccountStatusUnactiveException
 * Created : 2020-11-04 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-04 17:15
 */
public class AccountStatusUnactiveException extends AbstractAuthenticationException {
    public AccountStatusUnactiveException(String msg) {
        super(UnauthrizedErrorCode.USER_STATUS, msg);
    }

    public AccountStatusUnactiveException(String msg, Throwable t) {
        super(UnauthrizedErrorCode.USER_STATUS, msg, t);
    }
}
