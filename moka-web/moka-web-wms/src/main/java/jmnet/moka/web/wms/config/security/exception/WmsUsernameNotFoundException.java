package jmnet.moka.web.wms.config.security.exception;

/**
 * <pre>
 * 사용자 정보 없음 에러 처리
 * Project : moka
 * Package : jmnet.moka.web.wms.config.security.exception
 * ClassName : WmsUsernameNotFoundException
 * Created : 2020-11-04 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-04 13:31
 */
public class WmsUsernameNotFoundException extends AbstractAuthenticationException {
    public WmsUsernameNotFoundException(String msg) {
        super(UnauthrizedErrorCode.GROUPWARE_NOTFOUND, msg);
    }

    public WmsUsernameNotFoundException(String msg, Throwable t) {
        super(UnauthrizedErrorCode.GROUPWARE_NOTFOUND, msg, t);
    }
}
