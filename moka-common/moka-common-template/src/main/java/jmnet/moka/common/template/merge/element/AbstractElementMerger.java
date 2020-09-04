package jmnet.moka.common.template.merge.element;

import static jmnet.moka.common.template.Constants.ATTR_ID;
import static jmnet.moka.common.template.Constants.name2ItemMap;
import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.parse.model.TemplateElement;

/**
 * <pre>
 * Element(커스텀 태그)를 머지한다.
 * 2019. 9. 4. kspark 최초생성
 * </pre>
 * @since 2019. 9. 4. 오후 4:17:48
 * @author kspark
 */
public abstract class AbstractElementMerger implements ElementMerger {

	protected TemplateMerger<?> templateMerger;
	private static final Logger logger = LoggerFactory.getLogger(AbstractElementMerger.class);

	protected AbstractElementMerger(TemplateMerger<?> templateMerger) throws IOException {
		this.templateMerger = templateMerger;
	}
	
	
	/**
	 * <pre>
	 * 디버그 정보를 추가한다.
	 * </pre>
	 * @param status 상태
	 * @param templateElement 엘리먼트
	 * @param indent 들여쓰기
	 * @param sb 스트링빌더
	 */
	public void debug(String status, TemplateElement templateElement, String indent, StringBuilder sb) {
		debug(status, templateElement.toString(), indent, sb);
	}

	/**
	 * <pre>
	 * 디버그 정보를 추가한다.
	 * </pre>
	 * @param status 상태
	 * @param info 정보메시지
	 * @param indent 들여쓰기
	 * @param sb 스트링빌더
	 */
	public void debug(String status, String info, String indent, StringBuilder sb)  {
		String msg = String.format("<!-- %s %s -->", status, info);
		sb.append("\r\n")
		.append(indent).append(msg)
		.append("\r\n") ;
		logger.trace(msg);
	}
	
	public abstract void merge(TemplateElement element, MergeContext context, StringBuilder sb) throws TemplateMergeException;
	
	public void startWrapItem(TemplateElement element, String indent, StringBuilder sb) {
		sb.append(indent)
		.append(this.templateMerger.getWrapItemStart(name2ItemMap.get(element.getNodeName()), element.getAttribute(ATTR_ID)))
		.append(System.lineSeparator());
	}
	
	public void endWrapItem(TemplateElement element, String indent, StringBuilder sb) {
		sb.append(indent)
		.append(this.templateMerger.getWrapItemEnd(name2ItemMap.get(element.getNodeName()), element.getAttribute(ATTR_ID)))
		.append(System.lineSeparator());
	}

}
