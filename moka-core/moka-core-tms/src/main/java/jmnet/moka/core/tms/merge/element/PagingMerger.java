package jmnet.moka.core.tms.merge.element;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import jmnet.moka.core.common.MokaConstants;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.GenericApplicationContext;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.template.Constants;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.merge.TemplateMerger;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.common.template.parse.model.TemplateNode;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tms.merge.KeyResolver;
import jmnet.moka.core.tms.merge.MspTemplateMerger;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.mvc.HttpParamMap;
import jmnet.moka.core.tms.template.parse.model.CpTemplateRoot;
import jmnet.moka.core.tms.template.parse.model.MspTemplateRoot;

public class PagingMerger extends MspAbstractElementMerger {

	private static final Logger logger = LoggerFactory.getLogger(PagingMerger.class);
	private static final String MERGE_PREV = "prev";
	private static final String MERGE_NEXT = "next";
	private static final String NEWLINE = "\r\n";
    private static final String ATTR_GROUP_SIZE = "groupSize";
    private int defaultGroupSize = 10;
	
    public PagingMerger(TemplateMerger<MergeItem> templateMerger) throws IOException {
		super(templateMerger);
		logger.debug("{} is Created", this.getClass().getName());
	}

    @Override
    public void setApplicationContext(GenericApplicationContext appContext) {
        super.setApplicationContext(appContext);
        String groupSizeStr =
                appContext.getBeanFactory().resolveEmbeddedValue("${tms.mte.page.group.size}");
        if (McpString.isNotEmpty(groupSizeStr)) {
            this.defaultGroupSize = Integer.parseInt(groupSizeStr);
        }
    }

    @Override
    public String makeCacheKey(TemplateElement element, MspTemplateRoot templateRoot,
            MergeContext context) {
        return "Not_Implemented";
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
        HttpParamMap httpParamMap = (HttpParamMap) context.get(MokaConstants.MERGE_CONTEXT_PARAM);
        int currentPage = httpParamMap.getInt(MokaConstants.PARAM_PAGE);
        currentPage =
                (currentPage == Integer.MIN_VALUE ? Constants.PARAM_PAGE_DEFAULT : currentPage);
        int pageCount = httpParamMap.getInt(Constants.PARAM_COUNT);
        if (pageCount == 0) {
            throw new TemplateMergeException("PageCount is Zero", element);
		}
        pageCount = (pageCount == Integer.MIN_VALUE ? Constants.PARAM_COUNT_DEFAULT : pageCount);
        try {
            String relCp = getRelatedComponentId(context, httpParamMap);
            if (relCp == null) {
                throw new TemplateMergeException("Paging relCp not found");
            }
            CpTemplateRoot cpTemplateRoot = getRelateComponent(context, relCp);
            boolean isComponentPaging = cpTemplateRoot.isComponentPaging();
            if (isComponentPaging) {
                pageCount = cpTemplateRoot.getPerPageCount();
            }
            // 페이지 사이즈를 등록한다.
            context.set(Constants.COUNT_TOKEN_NAME, pageCount);
            context.set(Constants.PARAM_COUNT, pageCount);

            // relCp가 있는지 확인하여 있을 경우 데이터를 로딩한다.
            JSONResult jsonResult = dataLoad(context, relCp, cpTemplateRoot);

            if (jsonResult != null) {
                int total = jsonResult.getTotal();
                int groupSize = defaultGroupSize;
                int maxPageCount = 0;
                if (isComponentPaging) {
                    groupSize = cpTemplateRoot.getDispPageCount();
                    maxPageCount = cpTemplateRoot.getMaxPageCount();
                } else {
                    String groupSizeAttr = element.getAttribute(ATTR_GROUP_SIZE);
                    if (McpString.isNotEmpty(groupSizeAttr)) {
                        groupSize = Integer.parseInt(groupSizeAttr);
                    }
                    maxPageCount = Integer.MAX_VALUE;
                }
                this.mergePaging(element, context, total, currentPage, pageCount, groupSize,
                        maxPageCount, sb);
            } else {
                logger.warn("No Data is loaded");
            }
        } catch (TemplateParseException | TemplateLoadException e) {
            throw new TemplateMergeException(String.format("Paging Custom Tag Merge Error"), e);
        }
    }

    public void mergePaging(TemplateElement element, MergeContext context, int total,
            int currentPage, int count, int groupSize, int maxPageCount, StringBuilder sb)
            throws TemplateMergeException {
        int totalPage = (int) Math.ceil(total / (count * 1.0));
        if (totalPage > maxPageCount) {
            totalPage = maxPageCount;
        }

        int currentGroup = (int) Math.ceil(currentPage / (groupSize * 1.0));

        int startPage = (currentGroup - 1) * groupSize + 1;
        int endPage = currentGroup * groupSize > totalPage ? totalPage : currentGroup * groupSize;
        int prevPage = startPage - 1 == 0 ? 1 : startPage - 1;
        int nextPage = endPage + 1 > totalPage ? totalPage : endPage + 1;

        Map<String, StringBuilder> pagingMergeMap = new HashMap<String, StringBuilder>(8);
        for (TemplateNode node : element.childNodes()) {
            if (node.getNodeType() == Constants.TYPE_STATEMENT) {
                TemplateElement pagingChildElement = (TemplateElement) node;
                if (pagingChildElement.getNodeName().equals(Constants.EL_PREV_PAGE)) {
                    context.set(Constants.PAGE_NO_TOKEN_NAME, prevPage);
                    pagingMergeMap.put(MERGE_PREV, mergePagingChild(pagingChildElement, context));
                } else if (pagingChildElement.getNodeName().equals(Constants.EL_OTHER_PAGE)) {
                    for (int index = startPage; index < currentPage; index++) {
                        context.set(Constants.PAGE_NO_TOKEN_NAME, index);
                        pagingMergeMap.put(Integer.toString(index),
                                mergePagingChild(pagingChildElement, context));
                    }
                    for (int index = currentPage + 1; index <= endPage; index++) {
                        context.set(Constants.PAGE_NO_TOKEN_NAME, index);
                        pagingMergeMap.put(Integer.toString(index),
                                mergePagingChild(pagingChildElement, context));
                    }
                } else if (pagingChildElement.getNodeName().equals(Constants.EL_CURRENT_PAGE)) {
                    context.set(Constants.PAGE_NO_TOKEN_NAME, currentPage);
                    pagingMergeMap.put(Integer.toString(currentPage),
                            mergePagingChild(pagingChildElement, context));
                } else if (pagingChildElement.getNodeName().equals(Constants.EL_NEXT_PAGE)) {
                    context.set(Constants.PAGE_NO_TOKEN_NAME, nextPage);
                    pagingMergeMap.put(MERGE_NEXT, mergePagingChild(pagingChildElement, context));
                }
            }
        }
        String indent = context.getCurrentIndent();
        boolean isDebug = context.getMergeOptions().isDebug();
        if (isDebug)
            debug("START", "PAGING", indent + "\t", sb);
        sb.append(indent);
        sb.append(pagingMergeMap.get(MERGE_PREV));
        sb.append(NEWLINE);
        for (int index = startPage; index <= endPage; index++) {
            sb.append(indent);
            sb.append(pagingMergeMap.get(Integer.toString(index)));
            sb.append(NEWLINE);
        }
        sb.append(indent);
        sb.append(pagingMergeMap.get(MERGE_NEXT));
        sb.append(NEWLINE);
        if (isDebug)
            debug("END", "PAGING", indent + "\t", sb);
	}

    private String getRelatedComponentId(MergeContext context, HttpParamMap httpParamMap) {
        String relCp = (String) context.get(MokaConstants.ATTR_REL_CP);
        if (relCp == null) { // ESI인 경우 파라미터에서 얻어온다.
            relCp = (String) httpParamMap.get(MokaConstants.PARAM_REL_CP);
        }
        return relCp;
    }

    private CpTemplateRoot getRelateComponent(MergeContext context, String relCp)
            throws TemplateParseException, TemplateLoadException {
        CpTemplateRoot cpTemplateRoot = null;
        if (relCp != null) {
            cpTemplateRoot = (CpTemplateRoot) ((MspTemplateMerger) this.templateMerger)
                    .getParsedTemplate(MokaConstants.ITEM_COMPONENT, relCp);
        }
        return cpTemplateRoot;
    }



    private JSONResult dataLoad(MergeContext context, String relCp, CpTemplateRoot cpTemplateRoot) {
        JSONResult jsonResult = null;
        // relCp가 있는지 확인하여 있을 경우 데이터를 로딩한다.
        //        String relCp = getRelatedComponentId(context, httpParamMap);
        try {
            @SuppressWarnings("unchecked")
            Map<String, JSONResult> dataMap =
                    (HashMap<String, JSONResult>) context.get(MokaConstants.MERGE_DATA_MAP);
            if (dataMap != null && relCp != null) {
                jsonResult =
                        dataMap.get(KeyResolver.makeDataId(MokaConstants.ITEM_COMPONENT, relCp));
            }
            if (jsonResult == null && relCp != null) {
                jsonResult = cpTemplateRoot.loadData(this.templateMerger, context);
            }
        } catch (DataLoadException | ParseException | TemplateParseException
                | TemplateLoadException e) {
            logger.warn("DataLoad Fail: {} - component : {} {} {}",
                    ((MspTemplateMerger) this.templateMerger).getDomainId(),
                    MokaConstants.ITEM_COMPONENT, relCp, e.getMessage());
        }
        return jsonResult;
    }

}
