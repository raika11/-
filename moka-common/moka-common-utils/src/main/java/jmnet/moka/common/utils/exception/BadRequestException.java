package jmnet.moka.common.utils.exception;

import org.springframework.http.HttpStatus;

/**
 * 
 * <pre>
 * Bad Request Exception 처리
 * 2017. 4. 21. ince 최초생성
 * </pre>
 * @since 2017. 4. 21. 오후 3:16:12
 * @author ince
 */
@SuppressWarnings("serial")
public class BadRequestException extends RuntimeException {
	private HttpStatus httpStatus;

	private String message;

	public BadRequestException() {
		super();
	}

	public BadRequestException(HttpStatus httpStatus, String message) {
		super(message);
		this.httpStatus = httpStatus;
		this.message = message;
	}

	public BadRequestException(HttpStatus httpStatus, Throwable cause, String message) {
		super(message, cause);
		this.httpStatus = httpStatus;
		this.message = message;
	}

	public final HttpStatus getHttpStatus() {
		return httpStatus;
	}

	@Override
	public final String getMessage() {
		return message;
	}
}
