package jmnet.moka.core.tms.mvc.handler;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.DataLoader;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.DpsApiConstants;
import jmnet.moka.core.common.ItemConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.util.HttpHelper;
import jmnet.moka.core.tms.merge.MokaDomainTemplateMerger;
import jmnet.moka.core.tms.merge.MokaTemplateMerger;
import jmnet.moka.core.tms.merge.item.DomainItem;
import jmnet.moka.core.tms.mvc.CdnRedirector;
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
public class ArticleHandler extends AbstractHandler {
    private static final Logger logger = LoggerFactory.getLogger(ArticleHandler.class);

    @Autowired
    private HttpParamFactory httpParamFactory;

    @Autowired
    private DomainResolver domainResolver;

    @Autowired
    private CdnRedirector cdnRedirector;

    @Autowired
    private MokaDomainTemplateMerger domainTemplateMerger;

    public ArticleHandler() {
        this.handlerMethod = new HandlerMethod(this, this.findMethod(ArticleHandler.class));
    }

    public void setViewName(String viewName) {
        this.viewName = viewName;
    }

    public HandlerMethod resolvable(HttpServletRequest request, String requestPath, List<String> pathList, String domainId) {
        // case-insensitive URI 처리
        if (pathList.size() == 2 && requestPath.toLowerCase()
                                               .startsWith(MokaConstants.MERGE_ARTICE_PREFIX)) {
            try {
                String articleId = pathList.get(1);
                // 머지 옵션설정
                MergeContext mergeContext = new MergeContext(MOKA_FUNCTIONS);
                mergeContext.set(MokaConstants.MERGE_START_TIME, request.getAttribute(MokaConstants.MERGE_START_TIME));
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

    public String merge(HttpServletRequest request, HttpServletResponse response, Model model)
            throws IOException, TemplateMergeException, TemplateParseException, DataLoadException {
        // 머지 옵션설정
        MergeContext mergeContext = (MergeContext) request.getAttribute(MokaConstants.MERGE_CONTEXT);
        String articleId = (String) mergeContext.get(MokaConstants.MERGE_CONTEXT_ARTICLE_ID);

        // 도메인 정보를 설정한다.
        String domainId = (String) mergeContext.get(MokaConstants.MERGE_DOMAIN_ID);
        DomainItem domainItem = domainResolver.getDomainInfoById(domainId);
        mergeContext.set(MokaConstants.MERGE_CONTEXT_DOMAIN, domainItem);

        // CDN Redirect조건 판단
        String cdnRedirectUrl = this.cdnRedirector.getCdnUrl(domainItem.getString(ItemConstants.DOMAIN_SERVICE_PLATFORM),articleId);
        if ( cdnRedirectUrl != null) {
            response.sendRedirect(cdnRedirectUrl);
            return null;
        }

        // TODO 노출조건을 처리한다.
        // DPS API에 노출조건 조회, 멤버십으로 로그인/성인여부 판단
        MokaTemplateMerger templateMerger = this.domainTemplateMerger.getTemplateMerger(domainId);
        DataLoader loader = templateMerger.getDataLoader();
        // 기사조건 조회
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("totalId", articleId);
        JSONResult jsonResult = loader.getJSONResult(DpsApiConstants.ARTICLE_FLAG, paramMap, true);
        Map<String, Object> flagMap = jsonResult.getDataListFirst();
        if ( flagMap == null ) {  // flag가 없으면...
            return null;
        }
        String serviceFlag = (String)flagMap.get("SERVICE_FLAG");
        if (McpString.isEmpty(serviceFlag) || serviceFlag.equalsIgnoreCase("N")) {
            return null;  // 서비스기사 아님으로 redirect
        }
        String adultFlag = (String)flagMap.get("ADULT_FLAG");
        if (McpString.isEmpty(adultFlag) || adultFlag.equalsIgnoreCase("Y")) {
            return null; // 로그인 체크 + 성인체크, 그렇지 않으면 로그인으로  redirect
        }
        String payFlag = (String)flagMap.get("PAY_FLAG");
        if (McpString.isEmpty(adultFlag) || adultFlag.equalsIgnoreCase("Y")) {
            return null; // 로그인 체크 + 유료회원, 그렇지 않으면 로그인  redirect
        }

        // 예약어를 설정한다.
        ReservedMap reservedMap = domainResolver.getReservedMap(domainId);
        if (reservedMap != null) {
            mergeContext.set(MokaConstants.MERGE_CONTEXT_RESERVED, reservedMap);
        }

        // Htttp 파라미터 설정
        HttpParamMap httpParamMap = this.httpParamFactory.creatHttpParamMap(request);
        mergeContext.set(MokaConstants.MERGE_CONTEXT_PARAM, httpParamMap);



        // Http 헤더 설정
        mergeContext.set(MokaConstants.MERGE_CONTEXT_HEADER, HttpHelper.getHeaderMap(request));
        // Http 쿠기 설정
        mergeContext.set(MokaConstants.MERGE_CONTEXT_COOKIE, HttpHelper.getCookieMap(request));

        model.addAttribute(MokaConstants.MERGE_CONTEXT, mergeContext);
        return this.viewName;
    }

}
