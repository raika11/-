package jmnet.moka.web.bulk.exception;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.bulk.exception
 * ClassName : BulkException
 * Created : 2020-10-27 027 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-27 027 오후 5:24
 */

public class BulkException extends Exception {
    private static final long serialVersionUID = 3665896551680256135L;

    public BulkException(String message) {
        super(message);
    }

    @SuppressWarnings("unused")
    public BulkException(String message, Throwable cause) {
        super(message, cause);
    }
}
