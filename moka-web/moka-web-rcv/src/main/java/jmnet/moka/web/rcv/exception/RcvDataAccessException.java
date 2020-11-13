package jmnet.moka.web.rcv.exception;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.exception
 * ClassName : RcvDBExeption
 * Created : 2020-11-04 004 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-11-04 004 오후 2:48
 */
public class RcvDataAccessException extends RuntimeException {
    private static final long serialVersionUID = 2774777740761059077L;

    public RcvDataAccessException(String message) {
        super(message);
    }

    public RcvDataAccessException(String message, Throwable cause) {
        super(message, cause);
    }

    public RcvDataAccessException(Throwable cause) {
        super(cause);
    }
}
