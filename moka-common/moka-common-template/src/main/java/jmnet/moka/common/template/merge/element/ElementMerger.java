package jmnet.moka.common.template.merge.element;

import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.parse.model.TemplateElement;

public interface ElementMerger {
	
	/**
	 * <pre>
	 * 엘리먼트의 머지를 수행한다.
	 * </pre>
	 * @param element 엘리먼트
	 * @param context 컨텍스트
	 * @param sb 스트링빌더
	 * @throws TemplateMergeException 템플릿 머지 에외
	 */
	public void merge(TemplateElement element, MergeContext context, StringBuilder sb) throws TemplateMergeException;
	
}
