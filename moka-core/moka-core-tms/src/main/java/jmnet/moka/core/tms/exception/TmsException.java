package jmnet.moka.core.tms.exception;

/**
 * 
 * <pre>
 * Tms에서 발생하는 Exception
 * 2019. 6. 17. ince 최초생성
 * </pre>
 * 
 * @since 2019. 6. 17. 오후 2:59:15
 * @author krapsk
 */
public class TmsException extends Exception {

    private static final long serialVersionUID = 4848111658058553415L;

    public TmsException(String message) {
        super(message);
    }

    public TmsException(String message, Exception cause) {
		super(message, cause);
	}
	
}