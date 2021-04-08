package jmnet.moka.web.tms.mvc.handler;

import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jmnet.moka.common.template.exception.TemplateMergeException;
import jmnet.moka.common.template.exception.TemplateParseException;
import jmnet.moka.common.template.merge.MergeContext;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tms.merge.KeyResolver;
import jmnet.moka.core.tms.merge.MokaDomainTemplateMerger;
import jmnet.moka.core.tms.mvc.handler.AbstractHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.method.HandlerMethod;

/**
 * <pre>
 * 패키지(이슈, 시리즈, 토픽) 대한 http 머지 요청을 처리하기 위한 전처리 과정을 수행한다.
 * 서비스여부, 도메인정보 설정
 * 2020. 10. 12. kspark 최초생성
 * </pre>
 *
 * @author kspark
 * @since 2021. 03. 30. 오후 8:10:12
 */
public class PackageHandler extends AbstractHandler {
    private static final Logger logger = LoggerFactory.getLogger(PackageHandler.class);

    private final MokaDomainTemplateMerger domainTemplateMerger;

    public PackageHandler(@Autowired MokaDomainTemplateMerger domainTemplateMerger) {
        this.domainTemplateMerger = domainTemplateMerger;
        this.handlerMethod = new HandlerMethod(this, this.findMethod(PackageHandler.class));
    }

    @Override
    public HandlerMethod resolvable(HttpServletRequest request, String requestPath, List<String> pathList, String domainId)
            throws TemplateMergeException, TemplateParseException {
        // case-insensitive URI 처리
        if (pathList.size() == 2 && !pathList.get(1).equals("list") &&
                ( requestPath.toLowerCase().startsWith(MokaConstants.MERGE_ISSUE_PREFIX)
                || requestPath.toLowerCase().startsWith(MokaConstants.MERGE_SERIES_PREFIX)
                || requestPath.toLowerCase().startsWith(MokaConstants.MERGE_TOPIC_PREFIX)
                )) {
            // 패키지 처리 : /issue,series,topic(case insensitive)/id, list는 제외
            String packageType = pathList.get(0);
            String packageId = pathList.get(1);
            // 머지 옵션설정
            MergeContext mergeContext = new MergeContext(MOKA_FUNCTIONS);
            mergeContext.set(MokaConstants.MERGE_START_TIME, request.getAttribute(MokaConstants.MERGE_START_TIME));
            mergeContext.set(MokaConstants.MERGE_DOMAIN_ID, domainId);
            mergeContext.set(MokaConstants.MERGE_PATH, requestPath);
            mergeContext.set(MokaConstants.MERGE_CONTEXT_PACKAGE_TYPE, packageType);
            mergeContext.set(MokaConstants.MERGE_CONTEXT_PACKAGE_ID, packageId);
            request.setAttribute(MokaConstants.MERGE_CONTEXT, mergeContext);
            return this.handlerMethod;
        }
        return null;
    }

    public String merge(HttpServletRequest request, HttpServletResponse response, Model model) {
        // 머지 옵션설정
        MergeContext mergeContext = (MergeContext) request.getAttribute(MokaConstants.MERGE_CONTEXT);
        model.addAttribute(MokaConstants.MERGE_CONTEXT, mergeContext);
        return this.viewName;
    }

}
