package jmnet.moka.core.common.exception;

/**
 * <pre>
 * moka 공통 Exception 처리
 * Project : moka
 * Package : jmnet.moka.core.common.exception
 * ClassName : MokaException
 * Created : 2020-10-25 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-25 09:16
 */
public class MokaException extends Exception {

    public MokaException() {
        super();
    }

    public MokaException(String message) {
        super(message);
    }

    public MokaException(String message, Throwable t) {
        super(message, t);
    }

    public MokaException(Throwable t) {
        super(t);
    }

}
