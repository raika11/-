package jmnet.moka.common.template.merge.element;

import static jmnet.moka.common.template.Constants.COUNT_TOKEN_NAME;
import static jmnet.moka.common.template.Constants.EL_CURRENT_PAGE;
import static jmnet.moka.common.template.Constants.EL_NEXT_PAGE;
import static jmnet.moka.common.template.Constants.EL_OTHER_PAGE;
import static jmnet.moka.common.template.Constants.EL_PREV_PAGE;
import static jmnet.moka.common.template.Constants.PAGE_NO_TOKEN_NAME;
import static jmnet.moka.common.template.Constants.PARAM;
import static jmnet.moka.common.template.Constants.PARAM_COUNT;
import static jmnet.moka.common.template.Constants.PARAM_COUNT_DEFAULT;
import static jmnet.moka.common.template.Constants.PARAM_PAGE;
import static jmnet.moka.common.template.Constants.PARAM_PAGE_DEFAULT;
import static jmnet.moka.common.template.Constants.TYPE_STATEMENT;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jmnet.moka.common.ApiResult;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.common.template.parse.model.TemplateNode;

public class PagingMerger extends AbstractElementMerger {

	private static final Logger logger = LoggerFactory.getLogger(PagingMerger.class);
	private static final String MERGE_PREV = "prev";
	private static final String MERGE_NEXT = "next";
	private static final String NEWLINE = "\r\n";
	
	public PagingMerger(TemplateMerger<?> templateMerger) throws IOException {
		super(templateMerger);
		logger.debug("{} is Created", this.getClass().getName());
	}
	
	private int getParamInt(Map<String, Object> paramMap, String parameter) {
		if ( paramMap != null) {
			Object value = paramMap.get(parameter);
			if ( value != null) {
				return Integer.parseInt((String)value);				
			}
		}
		return Integer.MIN_VALUE;
	}
	
	private StringBuilder mergePagingChild(TemplateElement pagingElement, MergeContext context) throws TemplateMergeException {
		StringBuilder sb = new StringBuilder(128);
		for ( TemplateNode templateNode : pagingElement.childNodes() ) {
			templateNode.merge(this.templateMerger, context, sb);
		}
		return sb;
	}
	
	@Override
	public void merge(TemplateElement element, MergeContext context, StringBuilder sb) throws TemplateMergeException {
		@SuppressWarnings("unchecked")
		Map<String, Object> httpParamMap = (Map<String, Object>)context.get(PARAM);
		int currentPage = getParamInt(httpParamMap, PARAM_PAGE);
		currentPage = ( currentPage == Integer.MIN_VALUE ? PARAM_PAGE_DEFAULT : currentPage);
		int count = getParamInt(httpParamMap, PARAM_COUNT);
		if ( count == 0 ) {
            throw new TemplateMergeException("PageCount is Zero", element);
		}
		count = ( count == Integer.MIN_VALUE ? PARAM_COUNT_DEFAULT : count);
		// 페이지 사이즈를 등록한다.
		context.set(COUNT_TOKEN_NAME, count);
		int total =  context.getInt(ApiResult.MAIN_TOTAL);
        int totalPage = (int) Math.ceil(total / (count * 1.0));
		int prevPage = (currentPage<=1 ? 1 : currentPage - 1);
		int nextPage = (currentPage>=totalPage-1 ? totalPage : currentPage + 1);
		
		HashMap<String,StringBuilder> pagingMergeMap = new HashMap<String,StringBuilder>(8);
		for ( TemplateNode node : element.childNodes() ) {
			if ( node.getNodeType() == TYPE_STATEMENT ) { 
				TemplateElement pagingChildElement = (TemplateElement)node;
				if ( pagingChildElement.getNodeName().equals(EL_PREV_PAGE)) {
					context.set(PAGE_NO_TOKEN_NAME, prevPage);
					pagingMergeMap.put(MERGE_PREV, mergePagingChild(pagingChildElement, context));
				} else if ( pagingChildElement.getNodeName().equals(EL_OTHER_PAGE)) {
					for ( int index = 1; index < currentPage; index++) {
						context.set(PAGE_NO_TOKEN_NAME, index);
						pagingMergeMap.put(Integer.toString(index), mergePagingChild(pagingChildElement, context));
					}
					for ( int index = currentPage + 1 ; index <= totalPage; index++) {
						context.set(PAGE_NO_TOKEN_NAME, index);
						pagingMergeMap.put(Integer.toString(index), mergePagingChild(pagingChildElement, context));
					}
				} else if ( pagingChildElement.getNodeName().equals(EL_CURRENT_PAGE)) {
					context.set(PAGE_NO_TOKEN_NAME, currentPage);
					pagingMergeMap.put(Integer.toString(currentPage), mergePagingChild(pagingChildElement, context));
				} else if ( pagingChildElement.getNodeName().equals(EL_NEXT_PAGE)) {
					context.set(PAGE_NO_TOKEN_NAME, nextPage);
					pagingMergeMap.put(MERGE_NEXT, mergePagingChild(pagingChildElement, context));
				}
			}
		}
		String indent = context.getCurrentIndent();
		boolean isDebug = context.getMergeOptions().isDebug();
		if (isDebug) debug("START", "PAGING", indent+"\t", sb) ;
		sb.append(indent); sb.append(pagingMergeMap.get(MERGE_PREV)); sb.append(NEWLINE);
		for ( int index=1; index <= totalPage ; index++) {
			sb.append(indent); sb.append(pagingMergeMap.get(Integer.toString(index))); sb.append(NEWLINE);	
		}
		sb.append(indent); sb.append(pagingMergeMap.get(MERGE_NEXT)); sb.append(NEWLINE);
		if (isDebug) debug("END", "PAGING", indent+"\t", sb) ;
	}

}
