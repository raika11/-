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
public class GroupWareException extends Throwable {

    protected UnauthrizedErrorCode errorCode;

    public GroupWareException(UnauthrizedErrorCode errorCode) {
        this.errorCode = errorCode;
    }

    public GroupWareException(UnauthrizedErrorCode errorCode, Throwable t) {
        super(errorCode.getName(), t);
        this.errorCode = errorCode;
    }

    public UnauthrizedErrorCode getErrorCode() {
        return this.errorCode = errorCode;
    }
}
