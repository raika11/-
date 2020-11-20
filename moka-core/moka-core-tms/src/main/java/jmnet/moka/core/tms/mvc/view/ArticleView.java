package jmnet.moka.core.tms.mvc.view;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.common.ApiResult;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.cache.CacheManager;
import jmnet.moka.common.template.Constants;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.DataLoader;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.MokaDomainTemplateMerger;
import jmnet.moka.core.tms.merge.MokaFunctions;
import jmnet.moka.core.tms.merge.MokaTemplateMerger;
import jmnet.moka.core.tms.mvc.HttpParamMap;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.view.AbstractView;

/**
 * <pre>
 * 기사를 머징하여 브라우저로 보낸다
 * 2019. 9. 10. kspark 최초생성
 * </pre>
 *
 * @author kspark
 * @since 2019. 9. 10. 오후 3:54:35
 */
public class ArticleView extends AbstractView {
    private static final Logger logger = LoggerFactory.getLogger(ArticleView.class);

    @Value("${tms.mte.debug}")
    private boolean templateMergeDebug;

    @Value("${tms.page.cache}")
    private boolean isPageCache;

    @Autowired
    private MokaDomainTemplateMerger domainTemplateMerger;

    @Autowired(required = false)
    private CacheManager cacheManager;

    @Override
    protected boolean generatesDownloadContent() {
        return false;
    }

    private MokaFunctions functions = new MokaFunctions();

    /**
     * <pre>
     * http 머지 요청을 통해 수집된 정보를 취합하여 머지를 수행하여 결과를 반환한다.
     * </pre>
     *
     * @param model    모델
     * @param request  http 요청
     * @param response http 응답
     * @see AbstractView#renderMergedOutputModel(Map, HttpServletRequest, HttpServletResponse)
     */
    @Override
    protected final void renderMergedOutputModel(Map<String, Object> model, HttpServletRequest request, HttpServletResponse response) {

        // 머지 옵션설정
        MergeContext mergeContext = (MergeContext) model.get(MokaConstants.MERGE_CONTEXT);

        // debug 옵션
        mergeContext.getMergeOptions()
                    .setDebug(templateMergeDebug);
        long startTime = System.currentTimeMillis();

        String domainId = (String) mergeContext.get(MokaConstants.MERGE_DOMAIN_ID);
        String path = (String) mergeContext.get(MokaConstants.MERGE_PATH);
        String articleId = (String) mergeContext.get(MokaConstants.MERGE_CONTEXT_ARTICLE_ID);

        MokaTemplateMerger templateMerger = null;
        try {
            templateMerger = this.domainTemplateMerger.getTemplateMerger(domainId);
            DataLoader loader = templateMerger.getDataLoader();
            Map<String,Object> paramMap = new HashMap<>();
            paramMap.put("totalId",articleId);
            JSONResult jsonResult = loader.getJSONResult("article",paramMap,true);
            Map<String,Object> articleInfo = rebuildInfo(jsonResult);
            mergeContext.set("article",articleInfo);
            this.setCodesAndMenus(loader, articleInfo, mergeContext);
            response.setContentType("text/html; charset=UTF-8");

            PrintWriter writer = null;
            StringBuilder sb;
            try {
                writer = response.getWriter();
                sb = templateMerger.merge("PG",this.getArticlePage(articleInfo),mergeContext);
                writer.write(sb.toString());
            } catch (Exception e) {
                logger.error("Request:{}, Exception: {}", request.getRequestURI(), e.toString());
                throw e;
            } finally {
                if (writer != null) {
                    writer.flush();
                    writer.close();
                }
            }
        } catch (TemplateMergeException e) {
            e.printStackTrace();
        } catch (TemplateParseException e) {
            e.printStackTrace();
        } catch (DataLoadException | IOException e) {
            e.printStackTrace();
        }
    }

    private Map<String,Object> rebuildInfo(JSONResult jsonResult) {
        Map<String,Object> article = new HashMap<>();
        article.put("basic",jsonResult.getDataListFirst("BASIC"));
        article.put("content",jsonResult.getDataList("CONTENT"));
        article.put("reporter",jsonResult.getDataList("REPORTER"));
        article.put("meta",jsonResult.getDataList("META"));
        article.put("mastercode",jsonResult.getDataList("MASTERCODE"));
        article.put("servicemap",jsonResult.getDataList("SERVICEMAP"));
        article.put("keyword",jsonResult.getDataList("KEYWORD"));
        article.put("clickcnt",jsonResult.getDataList("CLICKCNT"));
        article.put("multi",jsonResult.getDataList("MULTI"));
        return article;
    }

    private void setCodesAndMenus(DataLoader loader, Map<String,Object> articleInfo, MergeContext mergeContext)
            throws DataLoadException {
        String masterCode = functions.joinColumn((List<Map<String, Object>>)articleInfo.get("mastercode"),"MASTER_CODE");
        String serviceCode = functions.joinColumn((List<Map<String, Object>>)articleInfo.get("servicemap"),"SERVICE_CODE");
        String sourceCode = (String)((Map<String,Object>)articleInfo.get("basic")).get("SOURCE_CODE");
        Map<String,Object> codesParam = new HashMap<>();
        codesParam.put(MokaConstants.MASTER_CODE_LIST, masterCode);
        codesParam.put(MokaConstants.SERVICE_CODE_LIST, serviceCode);
        codesParam.put(MokaConstants.SOURCE_CODE_LIST, sourceCode);
        JSONResult jsonResult = loader.getJSONResult("menu.codes",codesParam,true);
        Map<String, Object> map = jsonResult.getData();
        Map codes = (Map)map.get(MokaConstants.MERGE_CONTEXT_CODES);
        Map menus = (Map)map.get(MokaConstants.MERGE_CONTEXT_MENUS);
        mergeContext.set(MokaConstants.PARAM_CATEGORY,MokaConstants.MERGE_CONTEXT_CATEGORY);
        mergeContext.set(MokaConstants.MERGE_CONTEXT_CODES,codes);
        mergeContext.set(MokaConstants.MERGE_CONTEXT_MENUS,menus);

        // cache로 설정할 category를 추가한다.
        if ( codes != null) {
            HttpParamMap httpParamMap = (HttpParamMap) mergeContext.get(MokaConstants.MERGE_CONTEXT_PARAM);
            httpParamMap.put(MokaConstants.MERGE_CONTEXT_CATEGORY, (String) codes.get(MokaConstants.MERGE_CONTEXT_CATEGORY));
        }
    }

    private String getArticlePage(Map<String,Object> articleInfo) {
        Map<String,Object> basic = (Map<String,Object>)articleInfo.get("basic");
        String articleType = (String)basic.get("ART_TYPE");
        if ( articleType.equalsIgnoreCase("B")) {
            return "68";
        } else if ( articleType.equalsIgnoreCase("C")) {
            return "70";
        }
        return "70";
    }


}
