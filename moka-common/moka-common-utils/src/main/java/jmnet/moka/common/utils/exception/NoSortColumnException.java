package jmnet.moka.common.utils.exception;

/**
 * <pre>
 * 정령 컬럼에 이상이 있을 경우 예외처리 
 * 2020. 5. 18. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 5. 18. 오후 4:48:40
 * @author ince
 */
public class NoSortColumnException extends Exception {

    private static final long serialVersionUID = 6869325291938412284L;

    public NoSortColumnException(String message) {
        super(message);
    }

    public NoSortColumnException(String message, Throwable t) {
        super(message, t);
    }



}
