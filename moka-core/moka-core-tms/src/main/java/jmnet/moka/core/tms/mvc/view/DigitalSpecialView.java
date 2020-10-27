package jmnet.moka.core.tms.mvc.view;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URISyntaxException;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.common.cache.CacheManager;
import jmnet.moka.common.proxy.http.HttpProxy;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.MokaDomainTemplateMerger;
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
    private MokaDomainTemplateMerger templateMerger;

    @Autowired(required = false)
    private CacheManager cacheManager;

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
    protected final void renderMergedOutputModel(Map<String, Object> model, HttpServletRequest request, HttpServletResponse response) {

        // 머지 옵션설정
//        MergeContext mergeContext = (MergeContext) request.getAttribute(MokaConstants.MERGE_CONTEXT);
        MergeContext mergeContext = (MergeContext)model.get(MokaConstants.MERGE_CONTEXT);

        // TODO digital specail 정보를 가져오는 api를 정의하고 정보를 가져온다.
        // PC와 Mobile을 구분한다.
        // 메타 정보의 수정이 필요한 부분을 체크한다.


        response.setContentType("text/html; charset=UTF-8");
        PrintWriter writer;
        try {
            writer = response.getWriter();
            writer.print(this.httpProxy.getString("https://digitalspecial.joins.com/special/2020/0918_kepco"));
            writer.close();
        } catch (IOException | URISyntaxException e) {
            e.printStackTrace();
        }

    }

}
