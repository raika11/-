package jmnet.moka.core.tms.mvc;

import java.util.Enumeration;
import java.util.Map.Entry;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.util.UriComponentsBuilder;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.template.parse.model.TemplateElement;
import jmnet.moka.common.template.parse.model.TemplateRoot;
import jmnet.moka.core.common.MspConstants;
import jmnet.moka.core.tms.merge.item.PageItem;

public class HttpParamFactory {

    private static final int DEFAULT_SIZE = 4;

    @Value("${tms.http.param.page}")
    private String page;

    @Value("${tms.http.param.page.value}")
    private String pageValue;

    @Value("${tms.http.param.count}")
    private String count;

    @Value("${tms.http.param.count.value}")
    private String countValue;

    @Value("${tms.http.param.sort}")
    private String sort;

    @Value("${tms.http.param.sort.value}")
    private String sortValue;


    public HttpParamMap creatHttpParamMap(HttpServletRequest request) {
        return creatHttpParamMap(request, DEFAULT_SIZE);
    }

    public HttpParamMap creatHttpParamMap(HttpServletRequest request, int mapSize) {
        HttpParamMap parameterMap = new HttpParamMap(this, mapSize);
        @SuppressWarnings("unchecked")
        Enumeration<String> paramNameEnumeration = request.getParameterNames();
        while (paramNameEnumeration.hasMoreElements()) {
            String paramName = paramNameEnumeration.nextElement();
            String value = request.getParameter(paramName);
            if (paramName.equalsIgnoreCase(page)) {
                paramName = MspConstants.PARAM_PAGE;
            } else if (paramName.equalsIgnoreCase(count)) {
                paramName = MspConstants.PARAM_COUNT;
            } else if (paramName.equalsIgnoreCase(sort)) {
                paramName = MspConstants.PARAM_SORT;
            }
            if (value != null) {
                parameterMap.put(paramName, value);
            }
        }
        // page, count가 없을 경우 default값을 설정한다.
        if (parameterMap.containsKey(MspConstants.PARAM_PAGE) == false) {
            parameterMap.put(MspConstants.PARAM_PAGE, this.pageValue);
        }
        if (parameterMap.containsKey(MspConstants.PARAM_COUNT) == false) {
            parameterMap.put(MspConstants.PARAM_COUNT, this.countValue);
        }
        return parameterMap;
    }

    public String getMergeUrl(TemplateRoot templateRoot, TemplateElement element,
            MergeContext context,
            HttpParamMap paramMap) {
        UriComponentsBuilder builder = UriComponentsBuilder.newInstance();
        builder.path(String.join("", "_", templateRoot.getItemType(), "/", templateRoot.getId()));
        for (Entry<String, String> entry : paramMap.entrySet()) {
            builder.queryParam(entry.getKey(), entry.getValue());
        }

        if (templateRoot.getItemType().equals(MspConstants.ITEM_PAGE) == false) {
            PageItem pageItem = (PageItem) context.get(MspConstants.MERGE_CONTEXT_PAGE);
            if (pageItem != null) {
                builder.queryParam(MspConstants.PARAM_PAGE_ITEM_ID, pageItem.getItemId());
            }
            if (templateRoot.getItemType().equals(MspConstants.ITEM_TEMPLATE)) {
                String relCp = element.getAttribute(MspConstants.ATTR_REL_CP);
                if (relCp != null) {
                    builder.queryParam(MspConstants.PARAM_REL_CP, relCp);
                }
            }
        }
        return builder.build().encode().toString();
    }

}
