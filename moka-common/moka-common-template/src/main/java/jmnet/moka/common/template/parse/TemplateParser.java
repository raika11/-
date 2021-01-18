package jmnet.moka.common.template.parse;

import static jmnet.moka.common.template.Constants.ELEMENT_END;
import static jmnet.moka.common.template.Constants.ELEMENT_NONE;
import static jmnet.moka.common.template.Constants.ELEMENT_START;
import static jmnet.moka.common.template.Constants.ELEMENT_WHOLE;
import static jmnet.moka.common.template.Constants.TOKEN_1;
import static jmnet.moka.common.template.Constants.TOKEN_2;
import static jmnet.moka.common.template.Constants.TOKEN_3;
import static jmnet.moka.common.template.Constants.preserveChildText;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.common.template.parse.model.TemplateNode;
import jmnet.moka.common.template.parse.model.TemplateRoot;

/**
 * 
 * <pre>
 * 템플릿을 파싱하여 DOM 형태의 구조를 반환한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * @since 2019. 9. 4. 오후 6:11:34
 * @author kspark
 */
public class TemplateParser {

	private static final Logger logger = LoggerFactory.getLogger(TemplateParser.class);
	
	/**
	 * 
	 * <pre>
	 * 템플릿을 파싱하여 DOM 형태의 구조를 반환한다.
	 * </pre>
	 * @param type 템플릿 타입
	 * @param id 아이디
	 * @param templateText 템플릿 내용
	 * @return 파싱된 템플릿 정보
	 * @throws TemplateParseException 템플릿 파싱 오류
	 */
    public static TemplateRoot parse(String type, String id, String templateText)
            throws TemplateParseException {
		TemplateRoot templateRoot = new TemplateRoot(type, id);
        templateRoot.setTemplateSize(templateText.length());
		ElementIterator ei = new ElementIterator(templateRoot, templateText);
		try {
			addChild(templateRoot, ei, false);
			logger.trace("{} {} is parsed", type, id);
		} catch (TemplateParseException e) {
			logger.error("Template:{},{} Error: {} , Line={}",type, id,  e.getMessage(), e.getLineNumber());
			throw e;
        } catch (Exception e) {
            throw new TemplateParseException(TemplateParseException.UNEXPECTED, 0, e);
		}
		return templateRoot;
	}
	
    public static TemplateRoot parse(String templateText) throws TemplateParseException {
        return parse("UNKNOWN", "UNKNOWN", templateText);
    }

	/**
	 * <pre>
	 * 하위 노드를 추가한다.
	 * </pre>
	 * @param parent 상위 노드
	 * @param ei 템플릿 이터레이터
	 * @param preserveChildText
	 * @throws TemplateParseException
	 */
    private static boolean addChild(TemplateElement parent, ElementIterator ei,
            boolean preserveChildText) throws TemplateParseException {
		TemplateElement element = null;
		TemplateNode previous = null;
        short currentElementStatus = ELEMENT_NONE;
		while (ei.next()) {
            currentElementStatus = ei.getElementStatus();
            switch (currentElementStatus) {
                case ELEMENT_WHOLE:
                    parent.addChildren(ei.createTemplateTextAndToken(previous, false));
                    parent.addChild(previous = ei.createTemplateElement(parent.getLast()));
                    break;
                case ELEMENT_START:
                    parent.addChildren(ei.createTemplateTextAndToken(previous, false));
                    parent.addChild(
                            previous = element = ei.createTemplateElement(parent.getLast()));
                    int startLineNumber = ei.getLineNumber();
                    if (addChild(element, ei, preserveChildText(element.getNodeName())) == false) {
                        // ELEMENT_END를 찾지 못한 경우
                        throw new TemplateParseException(
                                TemplateParseException.ELEMENT_PAIR_NOT_MATCH,
                                startLineNumber);
                    }
                    break;
                case ELEMENT_END:
                    element = ei.createTemplateElement(previous);
                    if (parent.isPair(element)) {
                        parent.addChildren(
                                ei.createTemplateTextAndToken(previous, preserveChildText));
                        return true;
                    } else {
                        throw new TemplateParseException(
                                TemplateParseException.ELEMENT_PAIR_NOT_MATCH,
                                ei.getLineNumber());
                    }
                case ELEMENT_NONE:
                    parent.addChildren(ei.createTemplateTextAndToken(previous, false));
                    previous = parent.getLast();
				default:
					// no default case
					;
			}
		}
        return false;

	}
	
	/**
	 * <pre>
	 * Custom Token인지 확인한다.
	 * </pre>
	 * @param expr 표현식
	 * @return custom token 여부
	 */
	public static boolean hasToken(String expr) {
		int token1Index = expr.indexOf(TOKEN_1);
		int token2Index = expr.indexOf(TOKEN_2);
		int token3Index = expr.indexOf(TOKEN_3);
		if (token1Index+1 == token2Index && token2Index+2 < token3Index ) {
			return true;
		}
		return false;
	}
	
	/**
	 * <pre>
	 * Custom Token의 내의 표현식을 반환한다.
	 * </pre>
	 * @param expr 표현식
	 * @return custom token의 표현식
	 */
	public static String getExpression(String expr) {
		int token2Index = expr.indexOf(TOKEN_2);
		int token3Index = expr.indexOf(TOKEN_3);
		if ( hasToken(expr)) {
			return expr.substring(token2Index+1, token3Index);
		}
		return expr;
	}
}
