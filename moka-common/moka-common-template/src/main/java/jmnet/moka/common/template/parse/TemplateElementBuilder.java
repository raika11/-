package jmnet.moka.common.template.parse;

import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.common.template.parse.model.TemplateNode;
import jmnet.moka.common.template.parse.model.TemplateRoot;

/**
 * 
 * <pre>
 * 엘리먼트 텍스트에서 정보를 추출한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * @since 2019. 9. 4. 오후 6:10:24
 * @author kspark
 */
public class TemplateElementBuilder {
	private String text;
	private int lineNumber;
	private int index;
	private int textLength;
	private TemplateRoot templateRoot;
	
	public TemplateElementBuilder(TemplateRoot templateRoot, String text, int lineNumber) {
		this.templateRoot = templateRoot;
		this.text = text;
		this.textLength = this.text.length();
		this.index = 0;
		this.lineNumber = lineNumber;
	}
	
	public TemplateElement parse(TemplateNode previous) throws TemplateParseException {
		TemplateElement element = null;
		try {
			if ( this.text != null) { 
				skipWhitespace() ;
				int nodeNameStart = index;
				findWhitespace();
				element = new TemplateElement(this.templateRoot, text.substring(nodeNameStart, index), previous, this.lineNumber);
				while (true) {
                    try {
                        String attrName = readAttributeName();
                        if (attrName == null)
                            break;
                        String attrValue = readAttributeValue();
                        element.addAttribute(attrName, attrValue);
                        if (index == textLength)
                            break;
                    } catch (StringIndexOutOfBoundsException e) {
                        throw new TemplateParseException(
                                TemplateParseException.ATTRIBUTE_INCOMPLETE, this.lineNumber, e);
                    }
				}
			}
        } catch (TemplateParseException e) {
            throw e;
		} catch (Exception e) {
            throw new TemplateParseException(TemplateParseException.UNEXPECTED, this.lineNumber, e);
		}
		return element;
	}
	
	private void findWhitespace() {
		while ( index < textLength && Character.isWhitespace(text.charAt(index)) == false ) {
			index ++;
		}
	}
	
	private void skipWhitespace() {
		while (index < this.text.length() && Character.isWhitespace(text.charAt(index))) {
			index ++;
		}
	}
		
	private String readAttributeName() {
		skipWhitespace();
		if ( index == this.text.length()) return null;
		int attrNameStart = index;
		while (true)  {
			char aChar = text.charAt(index);
			if ( aChar == '=' ||  Character.isWhitespace(aChar)) {
				break;
			}
			index ++;
		}
		return text.substring(attrNameStart, index);
	}
	
    private String readAttributeValue() throws TemplateParseException {
		int attrValueStart = text.indexOf('\"', index);
		if ( attrValueStart == -1 ) {
            throw new TemplateParseException(TemplateParseException.ATTRIBUTE_INCOMPLETE,
                    this.lineNumber);
		}
		int attrValueEnd = text.indexOf('\"', attrValueStart+1);
		if ( attrValueEnd == -1 ) {
            throw new TemplateParseException(TemplateParseException.ATTRIBUTE_INCOMPLETE,
                    this.lineNumber);
		}
		index = attrValueEnd +1;
		return text.substring(attrValueStart+1, attrValueEnd);
	}
	
}
