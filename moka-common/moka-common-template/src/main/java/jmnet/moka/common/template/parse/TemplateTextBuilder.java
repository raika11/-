package jmnet.moka.common.template.parse;

import static jmnet.moka.common.template.Constants.TOKEN_1;
import static jmnet.moka.common.template.Constants.TOKEN_2;
import static jmnet.moka.common.template.Constants.TOKEN_3;
import java.util.ArrayList;
import java.util.List;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.parse.model.TemplateNode;
import jmnet.moka.common.template.parse.model.TemplateRoot;
import jmnet.moka.common.template.parse.model.TemplateText;
import jmnet.moka.common.template.parse.model.TemplateToken;

/**
 * 
 * <pre>
 * 템플릿의 텍스트 부분을 토큰과 텍스트로 구분한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * @since 2019. 9. 4. 오후 6:13:27
 * @author kspark
 */
public class TemplateTextBuilder {
	private String text;
	private int lineNumber;
	private int charIndex;
	private int textLength;
	private List<TemplateNode> children ;
	private TemplateRoot templateRoot;
	
	public TemplateTextBuilder(TemplateRoot templateRoot, String text, int lineNumber) {
		this.templateRoot = templateRoot;
		this.text = text;
		this.textLength = this.text.length();
		this.charIndex = 0;
		this.lineNumber = lineNumber;
		this.children = new ArrayList<TemplateNode>(64);
	}
	
	/**
	 * <pre>
	 * 토큰 분리 여부에 따라 텍스트와 토큰을 분리한다.
	 * </pre>
	 * @param previous 이전 노드
	 * @param parseToken 토큰 분리 여부
	 * @return 하위 노드
	 * @throws TemplateParseException 템플릿 파싱 예외
	 */
	public List<TemplateNode> parse(TemplateNode previous, boolean parseToken) throws TemplateParseException {
		if ( parseToken ) {
			parseText(previous);
		} else {
			List<String> lines = new ArrayList<String>(1);
			lines.add(this.text);
			this.children.add(new TemplateText(this.templateRoot, lines, previous, this.lineNumber));
		}
		return this.children;
	}
	
	public void parseText(TemplateNode previous) throws TemplateParseException {
		StringBuilder sb = new StringBuilder(128);
		List<String> lines = new ArrayList<String>(32);
		if ( this.text != null) {
			char prevChar = '\0';
			while ( charIndex < this.textLength ) {
				char aChar = text.charAt(charIndex);
				if ( prevChar== TOKEN_1 && aChar== TOKEN_2) {
					int endIndex = text.indexOf(TOKEN_3, charIndex +1) ;
					if ( endIndex == -1) {
                        throw new TemplateParseException(TemplateParseException.TOKEN_INCOMPLETE,
                                this.lineNumber);
					} else {
						sb.deleteCharAt(sb.length()-1); // '$'를 제거한다.
						lines.add(sb.toString());
						children.add( previous = new TemplateText(this.templateRoot, lines, previous, this.lineNumber));
						lines = new ArrayList<String>(32);
						children.add( previous = new TemplateToken(this.templateRoot, text.substring(charIndex+1, endIndex), previous, this.lineNumber));
						charIndex = endIndex +1;
						sb = new StringBuilder(128);
					}
				} else {
					sb.append(aChar);
					charIndex++;
					if ( aChar == '\n' ) {
						lines.add(sb.toString());
						this.lineNumber ++;
						sb = new StringBuilder(128);
					} 
				}
				prevChar = aChar;
			}
			// text가 더 있을 경우 추가로 넣어 준다.
			if (sb.length() > 0) lines.add(sb.toString());
			if ( lines.size() > 0 ) children.add(new TemplateText(this.templateRoot, lines, previous, this.lineNumber));
		}
	}

	
}
