package jmnet.moka.common.template.exception;

import jmnet.moka.common.template.parse.model.TemplateNode;
import jmnet.moka.common.template.parse.model.TemplateRoot;

/**
 * 
 * <pre>
 * 템플릿 파싱시 발생하는 Exception
 * 2019. 6. 17. ince 최초생성
 * </pre>
 * @since 2019. 6. 17. 오후 2:59:15
 * @author krapsk
 */
public class TemplateMergeException extends Exception {

	private static final long serialVersionUID = 6869325291938412284L;
	private TemplateNode templateNode;
	
    public TemplateMergeException(String message) {
        super(message);
    }

	public TemplateMergeException(String message, Exception cause) {
		super(message, cause);
	}
	
	public TemplateMergeException(String message, TemplateNode templateNode) {
		super(message);
		this.templateNode = templateNode;
	}
	
	public TemplateMergeException(String message, TemplateNode templateNode, Exception cause) {
		super(message, cause);
		this.templateNode = templateNode;
	}
	
	public TemplateNode getTemplateNode(){
		return this.templateNode;
	}
	
	public String getMessage() {
		if ( templateNode != null ) {
			TemplateRoot templateRoot = this.templateNode.getTemplateRoot();
			return String.format("%s : %s %s Line=%d : Node=%s %s", super.getMessage(), templateRoot.getItemType(), templateRoot.getId(), 
					templateNode.getLineNumber(), templateNode.getNodeName(),
					super.getCause() != null ? String.format(" : Cause=%s", super.getCause()) : "");
		} else {
			return super.getMessage() + (getCause() != null ? " , Caused By "+getCause(): "" );
		}
	}
	
//	public Throwable getCause() {
//		return super.getCause();
//	}
	
}