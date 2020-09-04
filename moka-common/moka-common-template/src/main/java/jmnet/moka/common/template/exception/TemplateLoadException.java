package jmnet.moka.common.template.exception;

/**
 * 
 * <pre>
 * 템플릿 로딩시 발생하는 Exception
 * 2019. 6. 17. ince 최초생성
 * </pre>
 * 
 * @since 2019. 6. 17. 오후 2:59:15
 * @author krapsk
 */
public class TemplateLoadException extends Exception {

	private static final long serialVersionUID = 6869325291938412284L;

    public TemplateLoadException(String message) {
		super(message);
	}
	
    public TemplateLoadException(String message, Exception cause) {
		super(message, cause);
	}
	
}