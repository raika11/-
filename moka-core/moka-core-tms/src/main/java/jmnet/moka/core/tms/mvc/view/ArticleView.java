package jmnet.moka.core.tms.mvc.view;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.cache.CacheManager;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.DataLoader;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.MokaDomainTemplateMerger;
import jmnet.moka.core.tms.merge.MokaTemplateMerger;
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
        Object obj = jsonResult.get("BASIC");
        article.put("basic",getData(jsonResult.get("BASIC")).get(0));
        article.put("content",getData(jsonResult.get("CONTENT")));
        article.put("reporter",getData(jsonResult.get("REPORTER")));
        article.put("meta",getData(jsonResult.get("META")));
        article.put("mastercode",getData(jsonResult.get("MASTERCODE")));
        article.put("servicemap",getData(jsonResult.get("SERVICEMAP")));
        article.put("keyword",getData(jsonResult.get("KEYWORD")));
        article.put("clickcnt",getData(jsonResult.get("CLICKCNT")));
        article.put("multi",getData(jsonResult.get("MULTI")));
        return article;
    }

    private List getData(Object obj) {
        try {
            return ((List) ((Map) obj).get("_DATA"));
        } catch (Exception e) {
            return null;
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
