package jmnet.moka.web.wms.config.security.exception;

/**
 * <pre>
 * 그룹웨어 아이디 없음 오류
 * Project : moka
 * Package : jmnet.moka.web.wms.config.security.exception
 * ClassName : GroupwareUserNotFoundException
 * Created : 2020-11-04 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-04 13:31
 */
public class GroupwareUserNotFoundException extends AbstractAuthenticationException {
    public GroupwareUserNotFoundException(String msg) {
        super(UnauthrizedErrorCode.GROUPWARE_NOTFOUND, msg);
    }

    public GroupwareUserNotFoundException(String msg, Throwable t) {
        super(UnauthrizedErrorCode.GROUPWARE_NOTFOUND, msg, t);
    }
}
