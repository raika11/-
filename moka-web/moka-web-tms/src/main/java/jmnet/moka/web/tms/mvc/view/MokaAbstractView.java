package jmnet.moka.web.tms.mvc.view;

import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.DataLoader;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.core.common.DpsApiConstants;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.MokaDomainTemplateMerger;
import jmnet.moka.core.tms.merge.item.MergeItem;
import jmnet.moka.core.tms.mvc.HttpParamMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.view.AbstractView;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.web.tms.mvc.view
 * ClassName : MokaAbstractView
 * Created : 2021-04-26 kspark
 * </pre>
 *
 * @author kspark
 * @since 2021-04-26 오후 9:10
 */
public class MokaAbstractView extends AbstractView {
    @Value("${list.sourceCodes.onlyJoongang}")
    private String sourceCodesOnlyJoongang;

    @Override
    protected void renderMergedOutputModel(Map<String, Object> model, HttpServletRequest request, HttpServletResponse response)
            throws Exception {

    }

    protected void setCodesAndMenus(MokaDomainTemplateMerger templateMerger, String domainId, MergeItem item, MergeContext mergeContext)
            throws TemplateMergeException, TemplateParseException, DataLoadException {
        String category = item.getString(ItemConstants.PAGE_CATEGORY);
        HttpParamMap httpParamMap = (HttpParamMap) mergeContext.get(MokaConstants.MERGE_CONTEXT_PARAM);
        if ( category == null) { // 페이지가 아닌 아이템에 파라미터로 들어올 경우
            category = httpParamMap.get(MokaConstants.PARAM_CATEGORY);
        }
        if (category == null) return;
        DataLoader loader = templateMerger
                .getTemplateMerger(domainId)
                .getDataLoader();
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put(MokaConstants.PARAM_CATEGORY, category);
        JSONResult jsonResult = loader.getJSONResult(DpsApiConstants.MENU_CATEGORY, paramMap, true);
        Map<String, Object> map = jsonResult.getData(); // 서비스 사용 코드들
        Map codes = (Map) map.get(MokaConstants.MERGE_CONTEXT_CODES);
        // OnlyJoongang인 경우 1,3,61로 변경
        if ( codes.get(MokaConstants.CATEGORY_FILTER_ONLY_JOONGANG).toString().equalsIgnoreCase("true")) {
            String filter = httpParamMap.get(MokaConstants.CATEGORY_FILTER_ONLY_JOONGANG_PARAM_NAME);
            if ( filter == null || !filter.equals(MokaConstants.CATEGORY_FILTER_ONLY_JOONGANG_PARAM_VALUE_ALL)) {
                codes.put(MokaConstants.CATEGORY_SOURCE_CODE_LIST, sourceCodesOnlyJoongang);
            }
        }
        Map menus = (Map) map.get(MokaConstants.MERGE_CONTEXT_MENUS);
        mergeContext.set(MokaConstants.PARAM_CATEGORY, category);
        mergeContext.set(MokaConstants.MERGE_CONTEXT_CODES, codes);
        mergeContext.set(MokaConstants.MERGE_CONTEXT_MENUS, menus);
    }
}
