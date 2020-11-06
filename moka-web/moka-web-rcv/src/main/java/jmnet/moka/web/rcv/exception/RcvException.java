package jmnet.moka.web.rcv.exception;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.rcv.exception
 * ClassName : RcvException
 * Created : 2020-10-27 027 sapark
 * </pre>
 *
 * @author sapark
 * @since 2020-10-27 027 오후 5:24
 */
public class RcvException extends Exception {
    private static final long serialVersionUID = -2277479172868094106L;

    public RcvException(String message) {
        super(message);
    }

    public RcvException(String message, Throwable cause) {
        super(message, cause);
    }
}
