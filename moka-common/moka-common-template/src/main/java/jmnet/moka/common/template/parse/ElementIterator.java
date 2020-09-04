package jmnet.moka.common.template.parse;

import static jmnet.moka.common.template.Constants.ELEMENT_END;
import static jmnet.moka.common.template.Constants.ELEMENT_NONE;
import static jmnet.moka.common.template.Constants.ELEMENT_START;
import static jmnet.moka.common.template.Constants.ELEMENT_WHOLE;
import static jmnet.moka.common.template.Constants.END_PREFIX;
import static jmnet.moka.common.template.Constants.END_PREFIX_LENGTH;
import static jmnet.moka.common.template.Constants.START_PREFIX;
import static jmnet.moka.common.template.Constants.START_PREFIX_LENGTH;
import java.util.List;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.common.template.parse.model.TemplateNode;
import jmnet.moka.common.template.parse.model.TemplateRoot;

/**
 * 
 * <pre>
 * 템플릿 엘리먼트(Custom Tag)와 텍스트 부분를 구분하여 반환한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * @since 2019. 9. 4. 오후 6:05:32
 * @author kspark
 */
public class ElementIterator {
	private String source;
	private int sourceLength;
	private int index = 0;
	private String text;
	private String elementText;
	private short elementStatus;
	private int lineNumber;
	private TemplateRoot templateRoot;
	
	public ElementIterator(TemplateRoot templateRoot, String source) {
		this.templateRoot = templateRoot;
		this.source = source;
		if ( this.source == null ) {
			this.sourceLength = 0;
		} else {
			this.sourceLength = source.length();
		}
		this.lineNumber = 1;
	}
	
    public boolean next() throws TemplateParseException {
		if ( index >= this.sourceLength ) {
			return false;
		}
		findElement();
		return true;
	}
	
	/**
	 * 
	 * <pre>
	 * 텍스트 부분을 토큰과 텍스트로 분리한다.
	 * </pre>
	 * @param previous 이전 노드
	 * @param preserveChildText 토큰 분리 여부
	 * @return 토큰과 텍스트 리스트
	 * @throws TemplateParseException 템플릿 파싱 예외
	 */
	public List<TemplateNode> createTemplateTextAndToken(TemplateNode previous, boolean preserveChildText) throws TemplateParseException {
		TemplateTextBuilder builder = new TemplateTextBuilder(this.templateRoot, this.text, this.lineNumber);
		return builder.parse(previous, preserveChildText == false);
	}

	/**
	 * <pre>
	 * 템플릿 엘리먼트를 생성한다.
	 * </pre>
	 * @param previous 이전 노드
	 * @return 템플릿 엘리먼트
	 * @throws TemplateParseException 템플릿 파싱 예외
	 */
	public TemplateElement createTemplateElement(TemplateNode previous) throws TemplateParseException {
		TemplateElementBuilder builder = new TemplateElementBuilder(this.templateRoot, this.elementText, this.lineNumber);
		return  builder.parse(previous);
	}
	
	/**
	 * 
	 * <pre>
	 * 템플릿 엘리먼트의 상태를 반환한다.
	 * 엘리먼트 시작, 엘리먼트 끝, 단일 엘리먼트, 엘리먼트가 아닌 경우
	 * </pre>
	 * @return 엘리먼트 상태
	 */
	public short getElementStatus() {
		return this.elementStatus;
	}
	
	/**
	 * 
	 * <pre>
	 * 템플릿의 라인번호를 반환한다.
	 * </pre>
	 * @return 라인번호
	 */
	public int getLineNumber() {
		return this.lineNumber;
	}
	
	/**
     * 
     * <pre>
     * 다음 엘리먼트 태그를 찾는다.
     * </pre>
     * 
     * @throws TemplateParseException 템플릿 파싱 오류
     */
    private void findElement() throws TemplateParseException {
		this.elementStatus = ELEMENT_NONE;
		this.elementText = null;
		StringBuilder sb = new StringBuilder(1024);
		while ( index < this.sourceLength ) {
			char aChar = source.charAt(index);
			if ( source.charAt(index) == '<') {
				if ( source.regionMatches(index, START_PREFIX, 0, START_PREFIX_LENGTH)) {
					this.elementStatus = ELEMENT_START;
				} else if ( source.regionMatches(index, END_PREFIX, 0, END_PREFIX_LENGTH)) {
					this.elementStatus = ELEMENT_END;
					index++; // '/'는 버린다.
				} 
				if ( this.elementStatus != ELEMENT_NONE) {
					index++;
					StringBuilder tagSb = new StringBuilder();
                    boolean hasGtSign = false;
					while ( index < this.sourceLength ) {
						char bChar = source.charAt(index);
						if ( bChar == '>') {
                            hasGtSign = true;
							if ( source.charAt(index-1) == '/') {
								this.elementStatus = ELEMENT_WHOLE;
								tagSb.deleteCharAt(tagSb.length()-1);
							} 
							break;
						} else {
							tagSb.append(bChar);
						}
						index ++;
					}
                    if (hasGtSign == false)
                        throw new TemplateParseException(TemplateParseException.ELEMENT_INCOMPLETE,
                                this.lineNumber);
					this.elementText = tagSb.toString();
					this.text = sb.toString();
					index++;
					break;
				} 
			} 
			
			if ( aChar == '\n' ) {
				this.lineNumber ++;
			} 
			sb.append(aChar);
			index++;
		}
		this.text = sb.toString();
	}

}
