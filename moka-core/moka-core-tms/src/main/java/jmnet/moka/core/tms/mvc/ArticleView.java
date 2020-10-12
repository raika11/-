/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tms.mvc;

import jmnet.moka.common.cache.CacheManager;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.MokaDomainTemplateMerger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.view.AbstractView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

/**
 * <pre>
 * 기사를 머징하여 브라우저로 보낸다
 * 2019. 9. 10. kspark 최초생성
 * </pre>
 * 
 * @since 2019. 9. 10. 오후 3:54:35
 * @author kspark
 */
public class ArticleView extends AbstractView {
    private static final Logger logger = LoggerFactory.getLogger(ArticleView.class);

    @Value("${tms.mte.debug}")
    private boolean templateMergeDebug;

    @Value("${tms.page.cache}")
    private boolean isPageCache;

    @Autowired
    private MokaDomainTemplateMerger templateMerger;

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
     * @param model
     * @param request
     * @param response
     * @throws IOException
     * @throws TemplateParseException
     * @throws NoHandlerFoundException
     * @throws TemplateMergeException
     * @see AbstractView#renderMergedOutputModel(Map,
     *      HttpServletRequest, HttpServletResponse)
     */
    @Override
    protected final void renderMergedOutputModel(Map<String, Object> model,
            HttpServletRequest request, HttpServletResponse response) throws IOException,
            TemplateParseException, NoHandlerFoundException, TemplateMergeException {

        // 머지 옵션설정
        MergeContext mergeContext = (MergeContext) request.getAttribute(MokaConstants.MERGE_CONTEXT);



    }

}
