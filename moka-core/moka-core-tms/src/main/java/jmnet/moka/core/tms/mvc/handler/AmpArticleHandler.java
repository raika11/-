package jmnet.moka.core.tms.mvc.handler;

import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.util.HttpHelper;
import jmnet.moka.core.tms.merge.MokaDomainTemplateMerger;
import jmnet.moka.core.tms.merge.item.DomainItem;
import jmnet.moka.core.tms.mvc.HttpParamFactory;
import jmnet.moka.core.tms.mvc.HttpParamMap;
import jmnet.moka.core.tms.mvc.domain.DomainResolver;
import jmnet.moka.core.tms.mvc.domain.ReservedMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.method.HandlerMethod;

/**
 * <pre>
 * 기사(article)에 대한 http 머지 요청을 처리하기 위한 전처리 과정을 수행한다.
 * 서비스여부, 도메인정보 설정,
 * 2020. 10. 12. kspark 최초생성
 * </pre>
 *
 * @author kspark
 * @since 2020. 10. 12. 오후 2:17:12
 */
public class AmpArticleHandler extends AbstractHandler {
    private static final Logger logger = LoggerFactory.getLogger(AmpArticleHandler.class);

    @Autowired
    private HttpParamFactory httpParamFactory;

    @Autowired
    private DomainResolver domainResolver;

    @Autowired
    private MokaDomainTemplateMerger domainTemplateMerger;

    public AmpArticleHandler() {
        this.handlerMethod = new HandlerMethod(this, this.findMethod(AmpArticleHandler.class));
    }

    public void setViewName(String viewName) {
        this.viewName = viewName;
    }

    public HandlerMethod resolvable(HttpServletRequest request, String requestPath, List<String> pathList, String domainId) {
        // case-insensitive URI 처리
        if (pathList.size() == 2 && requestPath.toLowerCase().startsWith(MokaConstants.MERGE_AMP_ARTICE_PREFIX)) {
            try {
                String articleId = pathList.get(1);
                // 머지 옵션설정
                MergeContext mergeContext = new MergeContext(MOKA_FUNCTIONS);
                this.setDeviceType(request, mergeContext);
                mergeContext.set(MokaConstants.MERGE_DOMAIN_ID, domainId);
                mergeContext.set(MokaConstants.MERGE_PATH, requestPath);
                mergeContext.set(MokaConstants.MERGE_CONTEXT_ARTICLE_ID, articleId);
                request.setAttribute(MokaConstants.MERGE_CONTEXT, mergeContext);
                return this.handlerMethod;
            } catch (Exception e) {
                logger.error("Article Find Fail: {} {}", domainId, requestPath, e);
                return null;
            }
        }
        return null;
    }

    public String merge(HttpServletRequest request, HttpServletResponse response, Model model) {
        // 머지 옵션설정
        MergeContext mergeContext = (MergeContext) request.getAttribute(MokaConstants.MERGE_CONTEXT);

        // 도메인 정보를 설정한다.
        String domainId = (String) mergeContext.get(MokaConstants.MERGE_DOMAIN_ID);
        DomainItem domainItem = domainResolver.getDomainInfoById(domainId);
        mergeContext.set(MokaConstants.MERGE_CONTEXT_DOMAIN, domainItem);

        // 예약어를 설정한다.
        ReservedMap reservedMap = domainResolver.getReservedMap(domainId);
        if (reservedMap != null) {
            mergeContext.set(MokaConstants.MERGE_CONTEXT_RESERVED, reservedMap);
        }

        // Htttp 파라미터 설정
        HttpParamMap httpParamMap = this.httpParamFactory.creatHttpParamMap(request);
        mergeContext.set(MokaConstants.MERGE_CONTEXT_PARAM, httpParamMap);

        String articleId = (String) mergeContext.get(MokaConstants.MERGE_CONTEXT_ARTICLE_ID);

        // Http 헤더 설정
        mergeContext.set(MokaConstants.MERGE_CONTEXT_HEADER, HttpHelper.getHeaderMap(request));
        // Http 쿠기 설정
        mergeContext.set(MokaConstants.MERGE_CONTEXT_COOKIE, HttpHelper.getCookieMap(request));

        model.addAttribute(MokaConstants.MERGE_CONTEXT, mergeContext);
        return this.viewName;
    }

}
