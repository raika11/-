package jmnet.moka.common.template.exception;

/**
 * 
 * <pre>
 * 템플릿 파싱시 발생하는 Exception
 * 2019. 6. 17. ince 최초생성
 * </pre>
 * @since 2019. 6. 17. 오후 2:59:15
 * @author krapsk
 */
public class TemplateParseException extends Exception {

	private static final long serialVersionUID = 6869325291938412284L;
	public static final int ELEMENT_INCOMPLETE = 0;
	public static final int ELEMENT_PAIR_NOT_MATCH = 1;
	public static final int ATTRIBUTE_INCOMPLETE = 2;
	public static final int TOKEN_INCOMPLETE = 3;
    public static final int CYCLE_TEMPLATE = 4;
	public static final int UNEXPECTED = 99;
	
    public static final String[] messages = {"태그 문법 오류", "종료태그 불일치 오류", "속성 문법 오류", "토큰 문법 오류"};
    public static final String UNEXPECTED_MESSAGE = "예상치 못한 오류";
	
	private int lineNumber;
    private int errorCode;

	public static class ErrorMessage {
        public static String getMessage(int errorCode) {
            if (errorCode >= ELEMENT_INCOMPLETE && errorCode <= CYCLE_TEMPLATE) {
	            return messages[errorCode];
	        } else {
                return UNEXPECTED_MESSAGE;
	        }
	    }
	}
	
	public TemplateParseException(int errorCode, int lineNumber) {
        super(ErrorMessage.getMessage(errorCode));
		this.lineNumber = lineNumber;
        this.errorCode = errorCode;
    }

    public TemplateParseException(int errorCode, String message, int lineNumber) {
        super(message);
        this.lineNumber = lineNumber;
        this.errorCode = errorCode;
	}
	
	public TemplateParseException(int errorCode, int lineNumber, Exception cause) {
        super(ErrorMessage.getMessage(errorCode), cause);
		this.lineNumber = lineNumber;
        this.errorCode = errorCode;
	}
	
	public int getLineNumber(){
		return this.lineNumber;
	}
	
    public int getErrorCode() {
        return this.errorCode;
	}

	public String getMessage() {
		return String.format("%s : Line=%d %s", super.getMessage(), this.lineNumber,
				super.getCause() == null ? "" : String.format("Cause = %s", super.getCause()));
	}
	
	public Throwable getCause() {
		return super.getCause();
	}

}