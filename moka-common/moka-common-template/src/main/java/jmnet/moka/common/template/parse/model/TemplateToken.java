package jmnet.moka.common.template.parse.model;

import static jmnet.moka.common.template.Constants.INFO_LINE;
import static jmnet.moka.common.template.Constants.INFO_NODE_NAME;
import static jmnet.moka.common.template.Constants.INFO_TEXT;
import static jmnet.moka.common.template.Constants.NODE_TOKEN;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;

/**
 * 
 * <pre>
 * 템플릿의 토큰( ${토큰} )을 표현하는 노드
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * @since 2019. 9. 4. 오후 6:25:10
 * @author kspark
 */
public class TemplateToken extends TemplateNode {
	private static final Logger logger = LoggerFactory.getLogger(TemplateToken.class);
	private String text;
	private boolean isOnlyVariable;
    private boolean isCommented;
	
	public TemplateToken(TemplateRoot templateRoot, String text, TemplateNode previous, int lineNumber) {
		super(templateRoot, NODE_TOKEN, previous, lineNumber);
		this.text = text.trim();
        this.isCommented = this.text.startsWith("/");
		this.isOnlyVariable = text.matches("[a-zA-Z_][a-zA-Z0-9_]+");
//		this.isOnlyVariable = this.text.chars().allMatch(codePoint -> {
//							return Character.isLetterOrDigit(codePoint) 
//							|| Character.isWhitespace(codePoint) == false
//							|| codePoint == '_'; });
		
		text.matches("[a-zA-Z_][a-zA-Z0-9_]+");
//		if ( this.isOnlyVariable && RESERVED_VARIABLES.contains(RESERVED_VARIABLE_PREFIX +this.text)) {
//			this.text = RESERVED_VARIABLE_PREFIX + this.text;
//		}
	}
	
    public String getText() {
        return this.text;
    }

	public Map<String, Object> infoMap() {
		Map<String, Object> map = new HashMap<String, Object>(4);
		map.put(INFO_NODE_NAME, this.nodeName);
		map.put(INFO_LINE, this.lineNumber);
		map.put(INFO_TEXT, this.text);
		return map;
	}

	@Override
	public void merge(TemplateMerger<?> merger, MergeContext context, StringBuilder sb) {
        if (this.isCommented)
            return;
		if ( this.isOnlyVariable) {
			if ( context.has(this.text) ) {
                Object value = context.get(this.text); 
                if ( value != null) {
                    sb.append(context.get(this.text));
                } else {
                    // null일 경우 넣지 않는다.
                }
			} else {
				logger.debug("Not Found Variable:{}", this.text);
			}
		} else {
			try {
				Object value = merger.getEvaluator().eval(text, context);
				if ( value != null ) {
					if ( Boolean.class.isInstance(value)) {
						sb.append((boolean)value);			
					} else if ( Integer.class.isInstance(value)) {
						sb.append((int)value);						
					} else {
						sb.append(value);
					}
				} else {
					// value가 null인 경우는 넣지 않는다.
				}
			} catch ( org.apache.commons.jexl3.JexlException.Variable e) {
				logger.debug("message:{}",e.getMessage());
			}
		}
	}

}
