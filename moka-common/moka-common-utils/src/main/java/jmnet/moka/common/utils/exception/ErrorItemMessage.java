package jmnet.moka.common.utils.exception;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;

/**
 * 
 * <pre>
 * 에러 메세지 아이템
 * 2017. 4. 21. ince 최초생성
 * </pre>
 * @since 2017. 4. 21. 오후 2:59:15
 * @author ince
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class ErrorItemMessage implements Serializable {
	private static final long serialVersionUID = 5572113616847158374L;
	/** 오류 발생 오브젝트 명 **/
	private String resource;

	/** 오류 필트 명 **/
	private String itemld;

	/** 오류 코드 **/
	private String code;

	/** 오류 메세지 **/
	private String message;

	/**
	 * @return resource
	 */
	public String getResource() {
		return resource;
	}

	/**
	 * @param resource
	 */
	public void setResource(String resource) {
		this.resource = resource;
	}

	/**
	 * @return itemld
	 */
	public String getItemld() {
		return itemld;
	}

	/**
	 * @param itemld
	 */
	public void setItemld(String itemld) {
		this.itemld = itemld;
	}

	/**
	 * @return code
	 */
	public String getCode() {
		return code;
	}

	/**
	 * @param code
	 */
	public void setCode(String code) {
		this.code = code;
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
}