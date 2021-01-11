package jmnet.moka.web.bulk.exception;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.exception
 * ClassName : BulkDataAccessException
 * Created : 2020-11-04 004 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-04 004 오후 2:48
 */

public class BulkDataAccessException extends RuntimeException {
    private static final long serialVersionUID = -8355009172853183938L;

    public BulkDataAccessException(String message) {
        super(message);
    }

    @SuppressWarnings("unused")
    public BulkDataAccessException(String message, Throwable cause) {
        super(message, cause);
    }

    public BulkDataAccessException(Throwable cause) {
        super(cause);
    }
}
