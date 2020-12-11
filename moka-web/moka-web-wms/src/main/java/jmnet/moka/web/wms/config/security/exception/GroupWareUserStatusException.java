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
public class GroupWareUserStatusException extends AbstractAuthenticationException {

    public GroupWareUserStatusException(UnauthrizedErrorCode errorCode, String msg) {
        super(errorCode, msg);
    }

    public GroupWareUserStatusException(String msg) {
        super(UnauthrizedErrorCode.GROUPWARE_ERROR, msg);
    }

    public GroupWareUserStatusException(String msg, Throwable t) {
        super(UnauthrizedErrorCode.GROUPWARE_ERROR, msg, t);
    }
}
