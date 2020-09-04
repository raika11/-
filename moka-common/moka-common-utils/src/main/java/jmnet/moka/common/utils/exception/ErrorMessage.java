package jmnet.moka.common.utils.exception;

import java.io.Serializable;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
/**
 * 
 * <pre>
 * 에러 메세지
 * 2017. 4. 21. ince 최초생성
 * </pre>
 * @since 2017. 4. 21. 오후 2:59:15
 * @author ince
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
@JsonPropertyOrder({
		"transactionId", "message", "detailMessage", "url", "status", "fieldErrors", "timestamp"
})
public class ErrorMessage implements Serializable {
	private static final long serialVersionUID = -7174809893610457006L;

	/** 날짜 **/
	private Date timestamp = Calendar.getInstance().getTime();

	/** 상태 **/
	private int status;

	/** 오류 메세지 **/
	private String message;

	/** 오류 상세 메세지 **/
	private String detailMessage;

	/** 오류 발생 필드 정보 **/
	private List<ErrorItemMessage> fieldErrors;

	/** 오류 url **/
	private String url;

	/**
	 * @return timestamp
	 */
	public Date getTimestamp() {
		return timestamp;
	}

	/**
	 * @param timestamp
	 */
	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}

	/**
	 * @return status
	 */
	public int getStatus() {
		return status;
	}

	/**
	 * @param status
	 */
	public void setStatus(int status) {
		this.status = status;
	}

	/**
	 * @return message
	 */
	public String getMessage() {
		return message;
	}

	/**
	 * @param message
	 */
	public void setMessage(String message) {
		this.message = message;
	}

	/**
	 * @return detailMessage
	 */
	public String getDetailMessage() {
		return detailMessage;
	}

	/**
	 * @param detailMessage
	 */
	public void setDetailMessage(String detailMessage) {
		this.detailMessage = detailMessage;
	}

	/**
	 * @return fieldErrors
	 */
	public List<ErrorItemMessage> getFieldErrors() {
		return fieldErrors;
	}

	/**
	 * @param fieldErrors
	 */
	public void setFieldErrors(List<ErrorItemMessage> fieldErrors) {
		this.fieldErrors = fieldErrors;
	}

	/**
	 * @return url
	 */
	public String getUrl() {
		return url;
	}

	/**
	 * @param url
	 */
	public void setUrl(String url) {
		this.url = url;
	}
}
