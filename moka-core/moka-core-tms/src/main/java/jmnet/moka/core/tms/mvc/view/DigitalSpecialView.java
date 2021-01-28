package jmnet.moka.core.tms.mvc.view;

import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.common.JSONResult;
import jmnet.moka.common.cache.CacheManager;
import jmnet.moka.common.proxy.http.HttpProxy;
import jmnet.moka.common.template.exception.DataLoadException;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.loader.DataLoader;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.core.common.DpsApiConstants;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.logger.ActionLogger;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.util.HttpHelper;
import jmnet.moka.core.tms.merge.MokaDomainTemplateMerger;
import jmnet.moka.core.tms.merge.MokaTemplateMerger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.view.AbstractView;

/**
 * <pre>
 * 디지털스페셜 콘텐츠를 로딩하여 브라우저로 내보낸다
 * 2020. 10. 10. kspark 최초생성
 * </pre>
 *
 * @author kspark
 * @since 2020. 10. 10. 오후 3:54:35
 */
public class DigitalSpecialView extends AbstractView {
    private static final Logger logger = LoggerFactory.getLogger(DigitalSpecialView.class);

    @Value("${tms.mte.debug}")
    private boolean templateMergeDebug;

    @Value("${tms.page.cache}")
    private boolean isPageCache;

    @Autowired
    private MokaDomainTemplateMerger domainTemplateMerger;

    @Autowired(required = false)
    private CacheManager cacheManager;

    @Autowired
    private ActionLogger actionLogger;

    @Autowired
    private HttpProxy httpProxy;

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
    protected final void renderMergedOutputModel(Map<String, Object> model, HttpServletRequest request, HttpServletResponse response)
            throws TemplateMergeException, TemplateParseException, DataLoadException {

        // 머지 옵션설정
        // MergeContext mergeContext = (MergeContext) request.getAttribute(MokaConstants.MERGE_CONTEXT);
        MergeContext mergeContext = (MergeContext) model.get(MokaConstants.MERGE_CONTEXT);
        String digitalSpecialId = (String) mergeContext.get(MokaConstants.MERGE_CONTEXT_DIGITAL_SPECIAL_ID);
        String domainId = (String) mergeContext.get(MokaConstants.MERGE_DOMAIN_ID);

        try {
            MokaTemplateMerger templateMerger = this.domainTemplateMerger.getTemplateMerger(domainId);
            DataLoader loader = null;
            if (templateMerger.isDefaultApiHostPathUse()) {
                loader = templateMerger.getDefaultDataLoader();
            } else {
                loader = templateMerger.getDataLoader();
            }
            Map<String, Object> paramMap = new HashMap<>();
            paramMap.put(MokaConstants.MERGE_CONTEXT_DIGITAL_SPECIAL_ID, digitalSpecialId);
            JSONResult jsonResult = loader.getJSONResult(DpsApiConstants.DIGITAL_SPECIAL_LIST, paramMap, true);
            Map map = jsonResult.getDataListFirst();
            if (map == null) {
                return; // 해당되는 id가 없으면 아무것도 표시하지 않는다.
            }
            String url = "";
            // PC와 Mobile을 구분한다.
            // 메타 정보의 수정이 필요한 부분을 체크한다.
            if (domainId.equals("1000")) {
                url = (String) map.get("PC_URL");
            } else {
                url = (String) map.get("MOB_URL");
            }
            response.setContentType("text/html; charset=UTF-8");
            PrintWriter writer = response.getWriter();
            writer.print(this.httpProxy.getString(url));
            writer.close();
            actionLogger.success(HttpHelper.getRemoteAddr(request), ActionType.DIGITAL_SPECIAL,
                    System.currentTimeMillis() - (long) mergeContext.get(MokaConstants.MERGE_START_TIME), digitalSpecialId);
        } catch (Exception e) {
            actionLogger.fail(HttpHelper.getRemoteAddr(request), ActionType.DIGITAL_SPECIAL,
                    System.currentTimeMillis() - (long) mergeContext.get(MokaConstants.MERGE_START_TIME), digitalSpecialId + " " + e.getMessage());
        }
    }

}
