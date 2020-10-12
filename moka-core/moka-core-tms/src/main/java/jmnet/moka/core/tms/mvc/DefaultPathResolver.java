package jmnet.moka.core.tms.mvc;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;

import jmnet.moka.core.common.MokaConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import jmnet.moka.common.template.exception.TemplateLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.core.tms.exception.TmsException;
import jmnet.moka.core.tms.merge.KeyResolver;
import jmnet.moka.core.tms.merge.MokaDomainTemplateMerger;
import jmnet.moka.core.tms.mvc.domain.DomainResolver;

/**
 * 
 * <pre>
 * http 요청 경로로 부터 머지를 위한 아이템의 존재여부를 확인하고 request attribute에 정보를 설정한다.
 * 해석가능한 경로는 url, 아이템(/_PG, /_CT, /_CP, /_TP ..), 본문 ( /view/) 이다.
 * 2020. 3. 20. kspark 최초생성
 * </pre>
 * 
 * @since 2020. 3. 20. 오후 4:18:55
 * @author kspark
 */
public class DefaultPathResolver {
	
	public final transient Logger logger = LoggerFactory.getLogger(getClass());
	
    private DomainResolver domainResolver;
    private MokaDomainTemplateMerger domainTemplateMerger;

    private List<String> mergeItemList;

    @Autowired
    public DefaultPathResolver(DomainResolver domainResolver,
                               MokaDomainTemplateMerger domainTemplateMerger) {
        this.domainResolver = domainResolver;
        this.domainTemplateMerger = domainTemplateMerger;
        String[] partialMergeItems = {MokaConstants.ITEM_PAGE, MokaConstants.ITEM_COMPONENT,
                MokaConstants.ITEM_CONTAINER,
                MokaConstants.ITEM_TEMPLATE};
        this.mergeItemList = Arrays.asList(partialMergeItems);
    }
	
    /**
     * <pre>
     * 실제 템플릿 아이템 경로를 URL로 부터 추출한다.
     * 예를 들면, page 파라미터 url마지막에 추가하는 경우 등
     * </pre>
     * 
     * @param request http요청
     * @return 템플릿 경로
     */
    private String resolvePath(HttpServletRequest request) {
		// TODO : REST URI일 경우 템플릿 경로와 파라메터 영역 분리 로직 필요
		return request.getRequestURI();
	}
	

    private List<String> getPathList(String path) {
        return Arrays.stream(path.split("/"))
                .filter(splitted -> splitted != null && splitted.length() > 0)
                .collect(Collectors.toList());
    }

    /**
     * <pre>
     * 1. 해당 URL에 대한 머지할 템플릿 아이템이 존재여부를 반환한다.
     * 2. 본문처리 url인지 확인한다.
     * 3. 아이템 머지인지 확인한다.
     * </pre>
     * 
     * @param request http요청
     * @return 템플릿 아이템 존재여부
     * @throws TemplateMergeException
     * @throws TemplateParseException
     * @throws TemplateLoadException
     * @throws TmsException
     */
    public boolean available(HttpServletRequest request)
            throws TemplateLoadException, TemplateParseException, TemplateMergeException,
            TmsException {
        String domainId = domainResolver.getDomainId(request);

        String paramDomain = request.getParameter("testDomain");
        if (paramDomain != null) {
            domainId = paramDomain;
        }

		// 서비스 도메인이 아닐 경우 다음 handlerMapping으로 넘긴다.
		if ( domainId == null) return false;

		String requestPath = resolvePath(request);
        String mergePath = requestPath;
		
		// url이 /로 끝날 경우 index페이지
        if (requestPath.endsWith("/")) {
            // / 일 경우를 제외하고 /를 제거한다.
            int index = requestPath.length() > 1 ? requestPath.length() - 1 : 1;
            mergePath = mergePath.substring(0, index);
        }
        if (requestPath.startsWith(MokaConstants.MERGE_ARTICE_PREFIX)) {
            // 본문처리 : /article/기사Id
            // TODO 기사id를 캐시키 생성시 처리하도록 http파라미터에 넣는다.
            if (mergeArticle(request, domainId, requestPath)) {
                return true;
            } else {
                // 404에러 페이지로 보낸다.
                mergePath = MokaConstants.TMS_ERROR_PAGE;
            }
        } else if (requestPath.startsWith("/_")) {
            // _CP, _TP, _CT 머지
            if (mergeItem(request, domainId, requestPath)) {
                return true;
            } else {
                // 404에러 페이지로 보낸다.
                mergePath = MokaConstants.TMS_ERROR_PAGE;
            }
        }

        // 템플릿 아이템이 존재할 경우 domainId, 템플릿 아이템 타입, 경로를 설정한다.
        try {
            String itemKey = this.domainTemplateMerger.getItemKey(domainId, mergePath);
            MergeContext mergeContext = new MergeContext();
            mergeContext.set(MokaConstants.MERGE_DOMAIN_ID, domainId);
            if (itemKey != null) {
                // 머지 옵션설정
                mergeContext.set(MokaConstants.MERGE_PATH, mergePath);
                mergeContext.set(MokaConstants.MERGE_ITEM_TYPE,
                        KeyResolver.getItemKeyFactor(itemKey, KeyResolver.ITEM_TYPE));
                mergeContext.set(MokaConstants.MERGE_ITEM_ID,
                        KeyResolver.getItemKeyFactor(itemKey, KeyResolver.ITEM_ID));
                request.setAttribute(MokaConstants.MERGE_CONTEXT, mergeContext);
                return true;
            } else {
                // 에러페이지로 보낸다
                itemKey =
                        this.domainTemplateMerger.getItemKey(domainId, MokaConstants.TMS_ERROR_PAGE);
                mergeContext.set(MokaConstants.MERGE_PATH, MokaConstants.TMS_ERROR_PAGE);
                mergeContext.set(MokaConstants.MERGE_ITEM_TYPE,
                        KeyResolver.getItemKeyFactor(itemKey, KeyResolver.ITEM_TYPE));
                mergeContext.set(MokaConstants.MERGE_ITEM_ID,
                        KeyResolver.getItemKeyFactor(itemKey, KeyResolver.ITEM_ID));
                request.setAttribute(MokaConstants.MERGE_CONTEXT, mergeContext);
                return true;

            }
        } catch (TemplateMergeException e) {
            logger.warn("Page Item not found: {} {}", domainId, mergePath);
        }
        return false;
	}

    private boolean mergeItem(HttpServletRequest request, String domainId, String path) {
        try {
            List<String> pathList = this.getPathList(path);
            String itemType = pathList.get(0).substring(1); // _제거
            if (this.mergeItemList.contains(itemType) == false)
                return false;

            String itemId = pathList.get(1);
            if (this.domainTemplateMerger.getItem(domainId, itemType, itemId) != null) {
                // 머지 옵션설정
                MergeContext mergeContext = new MergeContext();
                mergeContext.getMergeOptions().setPreviewResource(this.isPreviewResource(request));
                mergeContext.set(MokaConstants.MERGE_DOMAIN_ID, domainId);
                mergeContext.set(MokaConstants.MERGE_PATH, path);
                mergeContext.set(MokaConstants.MERGE_ITEM_TYPE, itemType);
                mergeContext.set(MokaConstants.MERGE_ITEM_ID, itemId);
                request.setAttribute(MokaConstants.MERGE_CONTEXT, mergeContext);
                return true;
            } else {
                logger.warn("MergeItem Find Fail: {} {} {}", domainId, itemType, itemId);
                return false;
            }
        } catch (TemplateLoadException | TemplateParseException | TemplateMergeException e) {
            logger.error("MergeItem Find Fail: {} {}", domainId, path, e);
            return false;
        }
    }

    private boolean mergeArticle(HttpServletRequest request, String domainId, String path) {
        try {
            List<String> pathList = this.getPathList(path);
            String articleId = pathList.get(1);
            // 머지 옵션설정
            MergeContext mergeContext = new MergeContext();
            mergeContext.set(MokaConstants.MERGE_DOMAIN_ID, domainId);
            mergeContext.set(MokaConstants.MERGE_PATH, path);
            mergeContext.set(MokaConstants.MERGE_CONTEXT_ARTICLE_ID, articleId);
            request.setAttribute(MokaConstants.MERGE_CONTEXT, mergeContext);
            return true;
        } catch (Exception e) {
            logger.error("Article Find Fail: {} {}", domainId, path, e);
            return false;
        }
    }

    private boolean isPreviewResource(HttpServletRequest request) {
        String preview = request.getParameter("previewResource");
        if (preview != null && preview.equals("true")) {
            return true;
        }
        return false;
    }
}
