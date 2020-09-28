package jmnet.moka.web.tms.mvc;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jmnet.moka.core.common.MokaConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.view.AbstractView;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.core.tms.merge.MspDomainTemplateMerger;

/**
 * <pre>
 * 템플릿을 머징하여 브라우저로 보낸다
 * 2019. 9. 10. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 10. 오후 3:54:35
 * @author kspark
 */
public class CustomMergeView extends AbstractView {
    private static final Logger logger = LoggerFactory.getLogger(CustomMergeView.class);

    @Value("${tms.mte.debug}")
    private boolean templateMergeDebug;

    @Autowired
    private MspDomainTemplateMerger templateMerger;

    //    @Autowired
    //    private CacheManager cacheManager;

    @Override
    protected boolean generatesDownloadContent() {
        return false;
    }

    @Override
    protected final void renderMergedOutputModel(Map<String, Object> model,
            HttpServletRequest request, HttpServletResponse response) throws IOException,
            TemplateParseException, NoHandlerFoundException, TemplateMergeException {

        // 머지 옵션설정
        MergeContext mergeContext = (MergeContext) request.getAttribute(MokaConstants.MERGE_CONTEXT);

        String domainId = (String) mergeContext.get(MokaConstants.MERGE_DOMAIN_ID);
        String templateType = (String) mergeContext.get(MokaConstants.MERGE_ITEM_TYPE);
        String path = (String) mergeContext.get(MokaConstants.MERGE_PATH);

        long startTime = System.currentTimeMillis();

        // 머지 옵션설정
        //        MergeContext context = (MergeContext) model.get(MspConstants.MERGE_CONTEXT);
        mergeContext.getMergeOptions().setDebug(templateMergeDebug);

        // 페이지 content-type
        Object pageInfo = mergeContext.get(MokaConstants.MERGE_CONTEXT_PAGE);
        if (pageInfo != null && pageInfo instanceof Map) {
            String pageType = ((String) ((Map<?, ?>) pageInfo).get("pageType"));
            response.setContentType(pageType + "; charset=UTF-8");
        } else {
            response.setContentType("text/html; charset=UTF-8");
        }
        PrintWriter writer = null;
        StringBuilder sb = null;
        try {
            writer = response.getWriter();
            // cache 확인
            //            String cacheType = "page";
            //            String cacheKey = domainId + "_" + path;
            //            String cachedPage = this.cacheManager.get(cacheType, cacheKey);
            //            if (cachedPage != null) {
            //                writer.append(cachedPage);
            //            } else {
                sb = templateMerger.merge(domainId, templateType, path, mergeContext);
                writer.append(sb);
            //                this.cacheManager.set(cacheType, cacheKey, sb.toString());
            //            }
        } catch (Exception e) {
            logger.error("Request:{}, Exception: {}", request.getRequestURI(), e.toString());
            throw e;
        } finally {
            writer.flush();
            writer.close();
        }

        logger.debug("Template Merge Completed: {}ms {} {}", System.currentTimeMillis() - startTime,
                domainId, path);

    }

}
