package jmnet.moka.web.wms.config.security.exception;

/**
 * <pre>
 * 장기 미방문자 오류 처리
 * Project : moka
 * Package : jmnet.moka.web.wms.config.security.exception
 * ClassName : LongTermUnconnectedException
 * Created : 2020-11-04 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-04 13:31
 */
public class LongTermUnconnectedException extends AbstractAuthenticationException {
    public LongTermUnconnectedException(String msg) {
        super(UnauthrizedErrorCode.LONG_TERM, msg);
    }

    public LongTermUnconnectedException(String msg, Throwable t) {
        super(UnauthrizedErrorCode.LONG_TERM, msg, t);
    }
}
