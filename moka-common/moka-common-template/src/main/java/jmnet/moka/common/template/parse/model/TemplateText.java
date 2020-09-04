package jmnet.moka.common.template.parse.model;

import static jmnet.moka.common.template.Constants.INFO_LINE;
import static jmnet.moka.common.template.Constants.INFO_NODE_NAME;
import static jmnet.moka.common.template.Constants.INFO_TEXT;
import static jmnet.moka.common.template.Constants.NODE_TEXT;
import static jmnet.moka.common.template.Constants.PREV_HAS_TAIL_SPACE;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;

/**
 * 
 * <pre>
 * 템플릿의 텍스트 부분을 표현하는 노드
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * @since 2019. 9. 4. 오후 6:23:36
 * @author kspark
 */
public class TemplateText extends TemplateNode {
	private List<String> lines;
	private int lineLength;
	private String tailSpace;
	
	public TemplateText(TemplateRoot templateRoot, List<String> lines, TemplateNode previous, int lineNumber) {
		super(templateRoot, NODE_TEXT, previous, lineNumber);
		this.lines = lines;
		this.lineLength = lines.size();
		this.setTailSpace();
	}
	
	/**
	 * 
	 * <pre>
	 * 텍스트의 마지막 라인의 공백부분 보관한다.
	 * </pre>
	 */
	private void setTailSpace() {
		if ( this.lineLength == 0 ) {
			this.tailSpace = "";
		} else {
			String lastLine = this.lines.get(this.lineLength-1);
			if ( lastLine.length() == 0 ) { this.tailSpace = ""; return; }
			StringBuilder sb = new StringBuilder(64);
			for ( int i=lastLine.length()-1; i>= 0; i--) {
				char aChar = lastLine.charAt(i);
				if ( Character.isWhitespace(aChar) && aChar != '\r' & aChar !='\n') 
					sb.append(aChar);
				else
					break;
			}
			sb.reverse();
			this.tailSpace = sb.toString();
		}
	}
	
	public List<String> getLines() {
		return this.lines;
	}
	
	@Override
	public String getTailSpace() {
		return this.tailSpace;
	}
	
	public Map<String, Object> infoMap() {
		Map<String, Object> map = new HashMap<String, Object>(4);
		map.put(INFO_NODE_NAME, this.nodeName);
		map.put(INFO_LINE, this.lineNumber);
		map.put(INFO_TEXT, lines.stream().collect(Collectors.joining()));
		return map;
	}
	
	@Override
	public void merge(TemplateMerger<?> merger, MergeContext context, StringBuilder sb) {
		String indent = context.getCurrentIndent();
		boolean isDebug = context.getMergeOptions().isDebug();
		boolean prevHasTailSpace = (boolean)context.get(PREV_HAS_TAIL_SPACE);
		for ( int i=0; i< lineLength; i++) {
			if ( isDebug ) {
				if ( (i==0 && this.previousIsToken() == false) || i > 0) // previous가 token인 경우만 indent를 넣지 않음
					sb.append(indent);
				sb.append(lines.get(i));
			} else {
				// 첫번째 라인 && 이전 노드가 토큰이 아니고 && (prev 노드가 없고 이전노드의 indent가 없을 경우)
				// 첫번째 라인이 아닌 경우
				if (  (i == 0 && this.previousIsToken() == false &&  (this.previous == null && prevHasTailSpace == false)) || i > 0) {
					sb.append(indent);												
				} 
				sb.append(lines.get(i));
			}
		}
	}

}
