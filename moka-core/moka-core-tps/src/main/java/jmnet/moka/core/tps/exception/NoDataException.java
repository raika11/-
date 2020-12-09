/**
 * msp-tps NoContentException.java 2020. 1. 10. 오전 10:56:24 ssc
 */
package jmnet.moka.core.tps.exception;

/**<pre>
 * 데이타가 없을경우 Exception처리
 * 2020. 1. 10. ssc 최초생성
 * </pre>
 * @since 2020. 1. 10. 오전 10:56:24
 * @author ssc
 */
public class NoDataException extends Exception {

    private static final long serialVersionUID = 6869325291938412284L;

    public NoDataException() {
        super();
    }

    public NoDataException(String message) {
        super(message);
    }

    public NoDataException(String message, Throwable t) {
        super(message, t);
    }

}
