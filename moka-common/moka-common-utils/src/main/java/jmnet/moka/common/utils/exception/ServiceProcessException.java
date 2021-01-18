package jmnet.moka.common.utils.exception;

import org.springframework.http.HttpStatus;

/**
 * 
 * <pre>
 * Service Process 오류 처리
 * 2017. 4. 21. ince 최초생성
 * </pre>
 * @since 2017. 4. 21. 오후 3:17:00
 * @author ince
 */
public class ServiceProcessException extends RuntimeException {
	private static final long serialVersionUID = -6850550861177276252L;

	private final ErrorMessage message = new ErrorMessage();

	private final Exception exception;

	public ServiceProcessException(Exception e) {
		this(e, null);
	}

	public ServiceProcessException(Exception e, HttpStatus httpStatus) {
		super();
		if ( httpStatus != null) {
			int statusCode = httpStatus.value();
			if (statusCode >= 400 && statusCode < 500) {
				BadRequestException ire = new BadRequestException(httpStatus, e, e.getMessage());
				this.exception = ire;
			} else {
				this.exception = e;
			}
		} else {
			this.exception = e;
		}
		message.setDetailMessage(e.getMessage());
		if (httpStatus != null) {
			message.setStatus(httpStatus.value());
		}
	}	

	public final Exception getException() {
		return exception;
	}

	public final ErrorMessage getErrorMessage() {
		return message;
	}

	@Override
	public String getMessage() {
		if (this.exception != null) {
			return this.exception.getMessage();
		} else {
			return super.getMessage();
		}
	}
}
